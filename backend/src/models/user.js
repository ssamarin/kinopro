import { getDb } from '../db.js';

export async function findUserByEmail(email) {
  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return user;
  } catch (error) {
    console.error('Ошибка при поиске пользователя:', error);
    throw error;
  }
}

export async function createUser(email, passwordHash) {
  try {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return { id: result.lastID, email };
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}