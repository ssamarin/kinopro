import { getDb } from './db.js';

/**
 * Скрипт для добавления колонки profile_complete_status в таблицу users
 */
async function migrateAddProfileStatus() {
  try {
    console.log('Начинаем миграцию: добавление колонки profile_complete_status в таблицу users...');
    
    const db = await getDb();
    
    // Проверяем, существует ли уже колонка
    const tableInfo = await db.all('PRAGMA table_info(users)');
    const hasColumn = tableInfo.some(column => column.name === 'profile_complete_status');
    
    if (hasColumn) {
      console.log('Колонка profile_complete_status уже существует в таблице users');
    } else {
      // Добавляем колонку
      await db.run('ALTER TABLE users ADD COLUMN profile_complete_status INTEGER DEFAULT 0');
      console.log('Колонка profile_complete_status успешно добавлена в таблицу users');
    }
    
    // Теперь обновляем значения в колонке на основе наличия резюме
    const users = await db.all('SELECT id FROM users');
    console.log(`Найдено ${users.length} пользователей`);
    
    const usersWithResumes = await db.all('SELECT DISTINCT owner_user_id FROM resumes');
    console.log(`Найдено ${usersWithResumes.length} пользователей с резюме`);
    
    const userIdsWithResumes = new Set(usersWithResumes.map(user => user.owner_user_id));
    
    let updatedCount = 0;
    for (const user of users) {
      const status = userIdsWithResumes.has(user.id) ? 1 : 0;
      await db.run(
        'UPDATE users SET profile_complete_status = ? WHERE id = ?',
        [status, user.id]
      );
      updatedCount++;
    }
    
    console.log(`Обновлено ${updatedCount} пользователей`);
    console.log('Миграция успешно завершена');
  } catch (error) {
    console.error('Ошибка при выполнении миграции:', error);
  }
}

// Запускаем миграцию
migrateAddProfileStatus()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Критическая ошибка:', err);
    process.exit(1);
  }); 