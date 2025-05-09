import { getDb } from './db.js';

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Красноярск',
  'Самара',
  'Ростов-на-Дону'
];

const professionGroups = [
  'Режиссерский цех',
  'Актерский цех',
  'Операторский цех',
  'Продюсерский цех',
  'Сценарный цех',
  'Звукорежиссерский цех',
  'Гримерный цех',
  'Монтажный цех',
  'Художественный цех',
  'Технический цех'
];

const professions = [
  { name: 'Режиссер', group: 'Режиссерский цех' },
  { name: 'Режиссер монтажа', group: 'Режиссерский цех' },
  { name: 'Помощник режиссера', group: 'Режиссерский цех' },
  { name: 'Актер', group: 'Актерский цех' },
  { name: 'Актриса', group: 'Актерский цех' },
  { name: 'Каскадер', group: 'Актерский цех' },
  { name: 'Массовка', group: 'Актерский цех' },
  { name: 'Оператор', group: 'Операторский цех' },
  { name: 'Оператор-постановщик', group: 'Операторский цех' },
  { name: 'Ассистент оператора', group: 'Операторский цех' },
  { name: 'Продюсер', group: 'Продюсерский цех' },
  { name: 'Линейный продюсер', group: 'Продюсерский цех' },
  { name: 'Исполнительный продюсер', group: 'Продюсерский цех' },
  { name: 'Сценарист', group: 'Сценарный цех' },
  { name: 'Драматург', group: 'Сценарный цех' },
  { name: 'Автор диалогов', group: 'Сценарный цех' },
  { name: 'Звукорежиссер', group: 'Звукорежиссерский цех' },
  { name: 'Звукооператор', group: 'Звукорежиссерский цех' },
  { name: 'Композитор', group: 'Звукорежиссерский цех' },
  { name: 'Гример', group: 'Гримерный цех' },
  { name: 'Художник по гриму', group: 'Гримерный цех' },
  { name: 'Монтажер', group: 'Монтажный цех' },
  { name: 'Монтажер звука', group: 'Монтажный цех' },
  { name: 'Колорист', group: 'Монтажный цех' },
  { name: 'Художник-постановщик', group: 'Художественный цех' },
  { name: 'Художник по костюмам', group: 'Художественный цех' },
  { name: 'Костюмер', group: 'Художественный цех' },
  { name: 'Декоратор', group: 'Художественный цех' },
  { name: 'Реквизитор', group: 'Технический цех' },
  { name: 'Осветитель', group: 'Технический цех' },
  { name: 'Техник', group: 'Технический цех' },
  { name: 'Кастинг-директор', group: 'Режиссерский цех' }
];

async function seedData() {
  try {
    const db = await getDb();
    
    // Добавляем города
    console.log('Добавление городов...');
    for (const city of cities) {
      try {
        await db.run('INSERT INTO cities (city) VALUES (?)', [city]);
        console.log(`Город "${city}" добавлен`);
      } catch (error) {
        // Игнорируем ошибку UNIQUE constraint, если город уже существует
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`Город "${city}" уже существует`);
        } else {
          throw error;
        }
      }
    }
    
    // Добавляем группы профессий
    console.log('\nДобавление групп профессий...');
    const groupIdMap = {};
    
    for (const group of professionGroups) {
      try {
        const result = await db.run('INSERT INTO profession_groups (name) VALUES (?)', [group]);
        groupIdMap[group] = result.lastID;
        console.log(`Группа "${group}" добавлена с ID ${result.lastID}`);
      } catch (error) {
        // Игнорируем ошибку UNIQUE constraint, если группа уже существует
        if (error.message.includes('UNIQUE constraint failed')) {
          const existingGroup = await db.get('SELECT id FROM profession_groups WHERE name = ?', [group]);
          groupIdMap[group] = existingGroup.id;
          console.log(`Группа "${group}" уже существует с ID ${existingGroup.id}`);
        } else {
          throw error;
        }
      }
    }
    
    // Добавляем профессии
    console.log('\nДобавление профессий...');
    for (const profession of professions) {
      const groupId = groupIdMap[profession.group];
      
      if (!groupId) {
        console.error(`Ошибка: группа "${profession.group}" не найдена`);
        continue;
      }
      
      try {
        await db.run('INSERT INTO professions (name, group_id) VALUES (?, ?)', [profession.name, groupId]);
        console.log(`Профессия "${profession.name}" добавлена в группу "${profession.group}"`);
      } catch (error) {
        // Игнорируем ошибку UNIQUE constraint, если профессия уже существует
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`Профессия "${profession.name}" уже существует`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('\nЗаполнение базовых данных завершено!');
  } catch (error) {
    console.error('Ошибка при заполнении данных:', error);
  }
}

seedData()
  .then(() => {
    console.log('Скрипт выполнен успешно');
    process.exit(0);
  })
  .catch(err => {
    console.error('Ошибка выполнения скрипта:', err);
    process.exit(1);
  }); 