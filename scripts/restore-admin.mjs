/**
 * Восстановление / создание admin-пользователя.
 *
 * Запуск:
 *   node scripts/restore-admin.mjs
 *
 * Скрипт:
 *  1. Пытается найти существующий Firebase Auth аккаунт по email.
 *  2. Если нет — создаёт новый.
 *  3. Создаёт (или перезаписывает) документ users/{uid} в Firestore с ролью admin.
 */

import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// ─── НАСТРОЙ ЭТО ────────────────────────────────────────────────────────────
const ADMIN_NAME     = 'Goran Kojic';          // имя администратора
const ADMIN_EMAIL    = 'admin@example.com';     // ← замени на нужный email
const ADMIN_PASSWORD = 'Admin1234!';            // ← замени на новый пароль (мин. 6 симв.)
// ────────────────────────────────────────────────────────────────────────────

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
} catch {
  console.error('\n❌ Файл serviceAccountKey.json не найден!');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const authAdmin = getAuth();
const db = getFirestore();

async function main() {
  console.log('\n🔧 Восстановление администратора...\n');

  let uid;

  // 1. Ищем существующий Auth аккаунт
  try {
    const existing = await authAdmin.getUserByEmail(ADMIN_EMAIL);
    uid = existing.uid;
    console.log(`✅ Firebase Auth аккаунт найден: ${uid}`);
    // Обновляем пароль на случай если он был утерян
    await authAdmin.updateUser(uid, { password: ADMIN_PASSWORD, disabled: false });
    console.log('✅ Пароль обновлён');
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      // 2. Создаём новый Auth аккаунт
      const newUser = await authAdmin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        displayName: ADMIN_NAME,
        disabled: false,
      });
      uid = newUser.uid;
      console.log(`✅ Новый Firebase Auth аккаунт создан: ${uid}`);
    } else {
      console.error('❌ Ошибка Firebase Auth:', err.message);
      process.exit(1);
    }
  }

  // 3. Создаём / перезаписываем Firestore документ users/{uid}
  await db.collection('users').doc(uid).set({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    role: 'admin',
    createdAt: Timestamp.now(),
    disabled: false,
  });

  console.log(`✅ Firestore документ users/${uid} создан/обновлён`);
  console.log('\n🎉 Готово! Можешь войти в приложение:');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Пароль:   ${ADMIN_PASSWORD}`);
  console.log('\n   ⚠️  Смени пароль после входа!\n');
}

main().catch((e) => {
  console.error('❌ Критическая ошибка:', e);
  process.exit(1);
});
