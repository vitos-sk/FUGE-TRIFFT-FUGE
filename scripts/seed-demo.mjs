/**
 * Скрипт для заполнения демо-данных.
 *
 * Создаёт:
 *  - 4 тестовых рабочих
 *  - 5 объектов с адресами
 *  - Записи часов за последние 3 недели
 *
 * Запуск:
 *   node scripts/seed-demo.mjs
 *
 * Требует serviceAccountKey.json в корне проекта.
 */

import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
} catch {
  console.error('\n❌ Файл serviceAccountKey.json не найден!');
  console.error('   Скачай его: Firebase Console → Project Settings → Service accounts → Generate new private key');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();
const db = getFirestore();

// ─── Demo workers ──────────────────────────────────────────────────────────────
const WORKERS = [
  { name: 'Marko Petrović',  email: 'marko.petrovic@demo.test',  password: 'Demo1234!' },
  { name: 'Ivan Horvatić',   email: 'ivan.horvatic@demo.test',   password: 'Demo1234!' },
  { name: 'Tomáš Novák',    email: 'tomas.novak@demo.test',     password: 'Demo1234!' },
  { name: 'Stefan Müller',   email: 'stefan.mueller@demo.test',  password: 'Demo1234!' },
];

// ─── Demo objects ──────────────────────────────────────────────────────────────
const OBJECTS = [
  { title: 'Badezimmer Renovierung',  address: 'Schillerstraße 12',    city: 'Stuttgart',  status: 'in_progress' },
  { title: 'Küche – Neufugung',       address: 'Hauptstraße 47',       city: 'München',    status: 'in_progress' },
  { title: 'Terrassenfliesen',         address: 'Gartenweg 3',          city: 'Frankfurt',  status: 'new' },
  { title: 'Treppenstufen Marmor',    address: 'Rosenstraße 88',       city: 'Hamburg',    status: 'paused' },
  { title: 'Büro – Fußbodenbelag',    address: 'Industrieallee 21',    city: 'Berlin',     status: 'done' },
];

function dateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function ensureWorker(worker) {
  let uid;
  try {
    const rec = await auth.createUser({
      email: worker.email,
      password: worker.password,
      displayName: worker.name,
    });
    uid = rec.uid;
    console.log(`  ✅ Создан Auth-пользователь: ${worker.name}`);
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      const existing = await auth.getUserByEmail(worker.email);
      uid = existing.uid;
      console.log(`  ⚠️  Уже существует: ${worker.name} (uid: ${uid})`);
    } else {
      throw err;
    }
  }

  await db.collection('users').doc(uid).set({
    name: worker.name,
    email: worker.email,
    role: 'worker',
    createdAt: Timestamp.now(),
    disabled: false,
  }, { merge: true });

  return { ...worker, uid };
}

async function ensureObject(obj, adminUid) {
  const snap = await db.collection('objects')
    .where('title', '==', obj.title)
    .limit(1)
    .get();

  if (!snap.empty) {
    const id = snap.docs[0].id;
    console.log(`  ⚠️  Объект уже существует: "${obj.title}" (id: ${id})`);
    return id;
  }

  const ref = await db.collection('objects').add({
    title: obj.title,
    address: obj.address,
    city: obj.city,
    status: obj.status,
    deadline: null,
    createdBy: adminUid,
    createdAt: Timestamp.now(),
    materials: [],
    checklist: [],
    noteCount: 0,
  });
  console.log(`  ✅ Создан объект: "${obj.title}" (id: ${ref.id})`);
  return ref.id;
}

function calcMinutes(start, end, breakMins) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em) - (sh * 60 + sm) - breakMins);
}

async function seedHours(workers, objectIds, objectTitles) {
  let count = 0;
  // 3 weeks back, skip sundays
  for (let daysAgo = 21; daysAgo >= 0; daysAgo--) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    if (d.getDay() === 0) continue; // skip Sunday

    const date = dateStr(daysAgo);

    // 2-3 workers per day
    const dayWorkers = [...workers].sort(() => Math.random() - 0.5).slice(0, randInt(2, 3));

    for (const worker of dayWorkers) {
      const startH = randInt(7, 8);
      const endH = randInt(16, 18);
      const startTime = `${startH}:00`;
      const endTime = `${endH}:${randInt(0, 1) * 30 === 0 ? '00' : '30'}`;
      const breakMinutes = 30;
      const totalMinutes = calcMinutes(startTime, endTime, breakMinutes);
      const objIdx = randInt(0, objectIds.length - 1);

      await db.collection('workHours').add({
        userId: worker.uid,
        userName: worker.name,
        objectId: objectIds[objIdx],
        objectTitle: objectTitles[objIdx],
        date,
        startTime,
        endTime,
        breakMinutes,
        totalMinutes,
        createdAt: Timestamp.now(),
      });
      count++;
    }
  }
  return count;
}

async function main() {
  console.log('\n══════════════════════════════════════════');
  console.log('  Seed Demo-Daten für Fuge trifft Fuge');
  console.log('══════════════════════════════════════════\n');

  // Find admin uid (first admin user)
  const usersSnap = await db.collection('users').where('role', '==', 'admin').limit(1).get();
  let adminUid = 'seed-script';
  if (!usersSnap.empty) {
    adminUid = usersSnap.docs[0].id;
    console.log(`ℹ️  Используется admin uid: ${adminUid}\n`);
  } else {
    console.log('⚠️  Admin не найден, объекты будут созданы с uid="seed-script"\n');
  }

  console.log('▶ Создаю рабочих...');
  const workers = [];
  for (const w of WORKERS) {
    workers.push(await ensureWorker(w));
  }

  console.log('\n▶ Создаю объекты...');
  const objectIds = [];
  const objectTitles = [];
  for (const obj of OBJECTS) {
    const id = await ensureObject(obj, adminUid);
    objectIds.push(id);
    objectTitles.push(obj.title);
  }

  console.log('\n▶ Заполняю часы за 3 недели...');
  const count = await seedHours(workers, objectIds, objectTitles);

  console.log(`\n✅ Готово!`);
  console.log(`   Рабочих:  ${workers.length}`);
  console.log(`   Объектов: ${objectIds.length}`);
  console.log(`   Записей часов: ~${count}`);
  console.log('\n   Пароль всех рабочих: Demo1234!');
  console.log('══════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('\n❌ Ошибка:', err.message);
  process.exit(1);
});
