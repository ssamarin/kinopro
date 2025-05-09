import { getDb } from './db.js';

async function checkData() {
  try {
    const db = await getDb();
    
    // Получаем все города
    const cities = await db.all('SELECT * FROM cities ORDER BY city');
    console.log('Города в базе данных:');
    cities.forEach(city => {
      console.log(`ID: ${city.id}, Город: ${city.city}`);
    });
    
    // Получаем все группы профессий
    const professionGroups = await db.all('SELECT * FROM profession_groups ORDER BY name');
    console.log('\nГруппы профессий в базе данных:');
    professionGroups.forEach(group => {
      console.log(`ID: ${group.id}, Название: ${group.name}`);
    });
    
    // Получаем все профессии с их группами
    const professions = await db.all(`
      SELECT p.id, p.name, p.group_id, pg.name as group_name 
      FROM professions p
      JOIN profession_groups pg ON p.group_id = pg.id
      ORDER BY pg.name, p.name
    `);
    
    console.log('\nПрофессии в базе данных:');
    professions.forEach(profession => {
      console.log(`ID: ${profession.id}, Название: ${profession.name}, Группа: ${profession.group_name} (ID: ${profession.group_id})`);
    });
    
  } catch (error) {
    console.error('Ошибка при проверке данных:', error);
  }
}

checkData()
  .then(() => {
    console.log('\nПроверка данных завершена');
    process.exit(0);
  })
  .catch(err => {
    console.error('Ошибка выполнения скрипта:', err);
    process.exit(1);
  }); 