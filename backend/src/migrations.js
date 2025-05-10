import { getDb } from './db.js';

// Миграция: добавление полей first_name и last_name в таблицу users
export async function migrateUsers() {
  console.log('Запуск миграции пользователей...');
  const db = await getDb();
  
  try {
    // Проверяем, существуют ли уже колонки first_name и last_name
    const tableInfo = await db.all("PRAGMA table_info(users)");
    const hasFirstName = tableInfo.some(col => col.name === 'first_name');
    const hasLastName = tableInfo.some(col => col.name === 'last_name');
    
    // Если колонки уже существуют, пропускаем миграцию
    if (hasFirstName && hasLastName) {
      console.log('Колонки first_name и last_name уже существуют в таблице users');
      return;
    }
    
    // Добавляем колонки, если их нет
    if (!hasFirstName) {
      await db.run("ALTER TABLE users ADD COLUMN first_name TEXT");
      console.log('Колонка first_name добавлена в таблицу users');
    }
    
    if (!hasLastName) {
      await db.run("ALTER TABLE users ADD COLUMN last_name TEXT");
      console.log('Колонка last_name добавлена в таблицу users');
    }
    
    // Получаем всех пользователей
    const users = await db.all("SELECT id, email FROM users");
    console.log(`Найдено ${users.length} пользователей для миграции`);
    
    // Обновляем каждого пользователя, извлекая имя и фамилию из email
    for (const user of users) {
      const nameParts = user.email.split('@')[0].split('.');
      let firstName = '';
      let lastName = '';
      
      if (nameParts.length > 1) {
        firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
        lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
      } else {
        firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      }
      
      await db.run(
        "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?",
        [firstName, lastName, user.id]
      );
    }
    
    console.log('Миграция пользователей успешно завершена');
  } catch (error) {
    console.error('Ошибка при миграции пользователей:', error);
    throw error;
  }
}

// Миграция: добавление поля since в таблицу resumes
export async function migrateResumeSince() {
  console.log('Запуск миграции для поля since в таблице resumes...');
  const db = await getDb();
  
  try {
    // Проверяем, существует ли уже колонка since
    const tableInfo = await db.all("PRAGMA table_info(resumes)");
    const hasSince = tableInfo.some(col => col.name === 'since');
    
    // Если колонка уже существует, пропускаем миграцию
    if (hasSince) {
      console.log('Колонка since уже существует в таблице resumes');
      return;
    }
    
    // Добавляем колонку
    await db.run("ALTER TABLE resumes ADD COLUMN since TEXT");
    console.log('Колонка since добавлена в таблицу resumes');
    
    // Получаем все резюме
    const resumes = await db.all("SELECT id FROM resumes");
    console.log(`Найдено ${resumes.length} резюме для миграции`);
    
    // Для каждого резюме устанавливаем случайную дату начала карьеры (временное решение)
    for (const resume of resumes) {
      // Генерируем случайную дату за последние 20 лет
      const now = new Date();
      const yearsAgo = Math.floor(Math.random() * 20) + 1;
      const startYear = now.getFullYear() - yearsAgo;
      const startMonth = Math.floor(Math.random() * 12) + 1;
      const since = `${startYear}-${startMonth.toString().padStart(2, '0')}-01`;
      
      await db.run(
        "UPDATE resumes SET since = ? WHERE id = ?",
        [since, resume.id]
      );
    }
    
    console.log('Миграция поля since в таблице resumes успешно завершена');
  } catch (error) {
    console.error('Ошибка при миграции поля since:', error);
    throw error;
  }
}

// Миграция: создание таблицы reviews
export async function createReviewsTable() {
  console.log('Запуск миграции для создания таблицы reviews...');
  const db = await getDb();
  
  try {
    // Проверяем, существует ли уже таблица reviews
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews'");
    
    // Если таблица уже существует, пропускаем миграцию
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
  }
}

// Для запуска миграции из командной строки
if (process.argv[1].endsWith('migrations.js')) {
  Promise.all([migrateUsers(), migrateResumeSince(), createReviewsTable()])
    .then(() => {
      console.log('Все миграции успешно выполнены');
      process.exit(0);
    })
    .catch(err => {
      console.error('Ошибка выполнения миграций:', err);
      process.exit(1);
    });
} 