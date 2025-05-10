import { getDb } from './db.js';

async function createParticipantsTable() {
  console.log('Запуск создания таблицы participants...');
  const db = await getDb();
  
  try {
    // Проверяем, существует ли уже таблица participants
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='participants'");
    
    // Если таблица уже существует, пропускаем создание
    if (tableExists) {
      console.log('Таблица participants уже существует');
      return;
    }
    
    // Создаем таблицу participants
    await db.exec(`
      CREATE TABLE participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        list_of_ids TEXT NOT NULL, -- JSON строка с массивом ID избранных профессионалов
        owner_user_id INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    console.log('Таблица participants успешно создана');
  } catch (error) {
    console.error('Ошибка при создании таблицы participants:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

createParticipantsTable(); 