import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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
