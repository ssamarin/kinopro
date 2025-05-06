import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

// Асинхронная функция для получения соединения с базой данных
export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

// Инициализация базы данных
export async function initDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);
  console.log('База данных SQLite инициализирована');
  return db;
}