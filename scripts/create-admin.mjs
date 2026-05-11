/**
 * Скрипт для создания первого Admin-пользователя.
 *
 * Запуск:
 *   node scripts/create-admin.mjs
 *
 * Перед запуском:
 *   1. Скачай serviceAccountKey.json из Firebase Console:
 *      Project Settings → Service accounts → Generate new private key
 *   2. Положи файл в корень проекта (рядом с package.json)
 *   3. Заполни имя, email и пароль ниже
 */

import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { createInterface } from 'readline';

// ─── Настройки нового Admin-пользователя ──────────────────────────────────────
const ADMIN_NAME     = 'Goran Kojic';          // ← измени если нужно
const ADMIN_EMAIL    = 'goran@fuge-trifft-fuge.de'; // ← твой email
const ADMIN_PASSWORD = 'ChangeMe123!';         // ← сразу поменяй после входа
// ──────────────────────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  // Загружаем service account
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

  console.log('\n──────────────────────────────────────────');
  console.log('  Создание Admin-пользователя');
  console.log('──────────────────────────────────────────');
  console.log(`  Имя:    ${ADMIN_NAME}`);
  console.log(`  Email:  ${ADMIN_EMAIL}`);
  console.log(`  Пароль: ${ADMIN_PASSWORD}`);
  console.log('──────────────────────────────────────────');

  const confirm = await ask('\nПродолжить? (да/нет): ');
  rl.close();

  if (confirm.trim().toLowerCase() !== 'да' && confirm.trim().toLowerCase() !== 'y' && confirm.trim().toLowerCase() !== 'yes') {
    console.log('Отменено.');
    process.exit(0);
  }

  try {
    // Создаём пользователя в Firebase Auth
    let uid;
    try {
      const userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: ADMIN_NAME,
      });
      uid = userRecord.uid;
      console.log(`\n✅ Auth-пользователь создан: ${uid}`);
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        // Пользователь уже есть в Auth — просто берём его uid
        const existing = await auth.getUserByEmail(ADMIN_EMAIL);
        uid = existing.uid;
        console.log(`\n⚠️  Пользователь уже существует в Auth (uid: ${uid}), обновляю роль в Firestore...`);
      } else {
        throw err;
      }
    }

    // Записываем профиль в Firestore
    await db.collection('users').doc(uid).set({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      createdAt: Timestamp.now(),
      disabled: false,
    }, { merge: true });

    console.log('✅ Профиль записан в Firestore (role: admin)');
    console.log('\n──────────────────────────────────────────');
    console.log('  Готово! Можешь входить в приложение:');
    console.log(`  Email:  ${ADMIN_EMAIL}`);
    console.log(`  Пароль: ${ADMIN_PASSWORD}`);
    console.log('\n  ⚠️  Сразу смени пароль после первого входа!');
    console.log('──────────────────────────────────────────\n');

  } catch (err) {
    console.error('\n❌ Ошибка:', err.message);
    process.exit(1);
  }
}

main();
