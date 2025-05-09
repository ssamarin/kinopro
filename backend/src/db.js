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
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT
    );

    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profession_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS professions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      name TEXT UNIQUE NOT NULL,
      FOREIGN KEY (group_id) REFERENCES profession_groups(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_user_id INTEGER NOT NULL,
      professions_id INTEGER NOT NULL,
      city_id INTEGER NOT NULL,
      biography TEXT,
      media_url TEXT,
      feedback_ids TEXT,
      since TEXT,
      FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT,
      FOREIGN KEY (professions_id) REFERENCES professions(id) ON DELETE RESTRICT
    );
  `);
  console.log('База данных SQLite инициализирована');
  return db;
}