import { getDb } from './db.js';

/**
 * Скрипт для обновления статуса профиля пользователей.
 * Если у пользователя есть резюме, то его статус будет "заполнен" (1),
 * в противном случае - "не заполнен" (0).
 */
async function updateUserProfileStatus() {
  try {
    console.log('Начинаем обновление статуса профилей пользователей...');
    
    const db = await getDb();
    
    // Получаем всех пользователей
    const users = await db.all('SELECT id FROM users');
    console.log(`Найдено ${users.length} пользователей`);
    
    // Получаем всех пользователей с резюме
    const usersWithResumes = await db.all('SELECT DISTINCT owner_user_id FROM resumes');
    console.log(`Найдено ${usersWithResumes.length} пользователей с резюме`);
    
    // Создаем Set с ID пользователей, у которых есть резюме
    const userIdsWithResumes = new Set(usersWithResumes.map(user => user.owner_user_id));
    
    // Обновляем статус для всех пользователей
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
    console.log('Обновление статусов профилей завершено успешно');
  } catch (error) {
    console.error('Ошибка при обновлении статусов профилей:', error);
  }
}

// Запускаем обновление
updateUserProfileStatus()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Критическая ошибка:', err);
    process.exit(1);
  }); 