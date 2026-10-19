import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();

// Trigger: when a new notification document is created in Firestore
// Path: notifications/{userId}/items/{notifId}
export const sendPushOnNotification = onDocumentCreated(
  "notifications/{userId}/items/{notifId}",
  async (event) => {
    const userId = event.params.userId;
    const data = event.data?.data();
    if (!data) return;

    const title: string = data.title ?? "Neue Benachrichtigung";
    const body: string = data.body ?? "";

    // Get user's FCM token
    const userSnap = await getFirestore().doc(`users/${userId}`).get();
    const fcmToken: string | undefined = userSnap.data()?.fcmToken;
    if (!fcmToken) return;

    try {
      await getMessaging().send({
        token: fcmToken,
        // Data-only payload: the browser must NOT auto-display this.
        // Showing the notification is entirely up to firebase-messaging-sw.js
        // (onBackgroundMessage) — otherwise both fire and the user sees it twice.
        data: { title, body },
        webpush: {
          fcmOptions: { link: "/" },
        },
      });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;

      if (
        code === "messaging/invalid-registration-token" ||
        code === "messaging/registration-token-not-registered"
      ) {
        await getFirestore().doc(`users/${userId}`).update({ fcmToken: null });
      }
    }
  },
);

const TIME_ZONE = "Europe/Berlin";
const FIRESTORE_ALREADY_EXISTS = 6;

// Every Mon–Fri at 17:00 Berlin time (Cloud Scheduler handles DST):
// remind active workers who have not logged any hours today.
// Creating the notification doc is enough — sendPushOnNotification above
// delivers the push and the in-app bell picks the doc up.
export const remindWorkHours = onSchedule(
  { schedule: "0 17 * * 1-5", timeZone: TIME_ZONE },
  async () => {
    const db = getFirestore();
    // "en-CA" formats as YYYY-MM-DD, the same as workHours.date
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());

    const [workersSnap, todaySnap] = await Promise.all([
      db.collection("users").where("role", "==", "worker").get(),
      db.collection("workHours").where("date", "==", today).get(),
    ]);
    const alreadyLogged = new Set(todaySnap.docs.map((d) => d.get("userId") as string));

    await Promise.all(
      workersSnap.docs
        .filter((u) => u.get("disabled") !== true && !alreadyLogged.has(u.id))
        .map(async (u) => {
          try {
            // Fixed id + create(): a scheduler retry cannot send the reminder twice
            await db.doc(`notifications/${u.id}/items/hours-reminder-${today}`).create({
              title: "Stunden eintragen",
              body: "Bitte trage deine Arbeitszeit für heute ein.",
              type: "hours-reminder",
              objectId: null,
              read: false,
              createdAt: Timestamp.now(),
            });
          } catch (err: unknown) {
            if ((err as { code?: number }).code !== FIRESTORE_ALREADY_EXISTS) throw err;
          }
        }),
    );
  },
);
