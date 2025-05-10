import { getDb } from './db.js';

async function createReviewsTable() {
  console.log('Запуск создания таблицы reviews...');
  const db = await getDb();
  
  try {
    // Проверяем, существует ли уже таблица reviews
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews'");
    
    // Если таблица уже существует, пропускаем создание
    if (tableExists) {
      console.log('Таблица reviews уже существует');
      return;
    }
    
    // Создаем таблицу reviews
    await db.exec(`
      CREATE TABLE reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rating REAL NOT NULL CHECK (rating >= 0 AND rating <= 5 AND (rating * 2) = ROUND(rating * 2)),
        text TEXT,
        reviewed_user_id INTEGER NOT NULL,
        reviewer_user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    console.log('Таблица reviews успешно создана');
  } catch (error) {
    console.error('Ошибка при создании таблицы reviews:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

createReviewsTable(); 