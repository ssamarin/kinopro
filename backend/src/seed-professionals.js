import { getDb } from './db.js';
import bcrypt from 'bcryptjs';

// Массив с данными для специалистов
const professionals = [
  {
    email: 'ivan.petrov@example.com',
    password: 'password123',
    firstName: 'Иван',
    lastName: 'Петров',
    profession: 'Режиссер',
    experience: 7,
    city: 'Москва',
    bio: 'Режиссер художественных и документальных фильмов с опытом работы более 7 лет. Специализируюсь на драмах и психологических триллерах. Обладатель нескольких наград кинофестивалей.',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    email: 'elena.ivanova@example.com',
    password: 'password123',
    firstName: 'Елена',
    lastName: 'Иванова',
    profession: 'Актриса',
    experience: 5,
    city: 'Санкт-Петербург',
    bio: 'Профессиональная актриса с театральным образованием. Снималась в главных ролях в театральных постановках, рекламных роликах и телесериалах. Владею навыками сценической речи и актерского мастерства.',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    email: 'alex.smirnov@example.com',
    password: 'password123',
    firstName: 'Александр',
    lastName: 'Смирнов',
    profession: 'Оператор',
    experience: 10,
    city: 'Москва',
    bio: 'Опытный оператор-постановщик. Работал над документальными фильмами, рекламными роликами и музыкальными клипами. Имею собственное оборудование высокого класса и умею работать в сложных условиях.',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    email: 'maria.kuznetsova@example.com',
    password: 'password123',
    firstName: 'Мария',
    lastName: 'Кузнецова',
    profession: 'Сценарист',
    experience: 8,
    city: 'Казань',
    bio: 'Сценарист с опытом написания полнометражных фильмов, сериалов и рекламных роликов. Создаю яркие и запоминающиеся истории с проработанными персонажами. Моя сильная сторона - диалоги и нестандартные сюжетные ходы.',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    email: 'dmitry.novikov@example.com',
    password: 'password123',
    firstName: 'Дмитрий',
    lastName: 'Новиков',
    profession: 'Продюсер',
    experience: 15,
    city: 'Москва',
    bio: 'Продюсер с большим опытом в кино- и телепроизводстве. Успешно запустил и реализовал более 20 проектов. Имею обширную сеть контактов в индустрии и хороший вкус на коммерчески успешные проекты.',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    email: 'olga.belova@example.com',
    password: 'password123',
    firstName: 'Ольга',
    lastName: 'Белова',
    profession: 'Гример',
    experience: 6,
    city: 'Екатеринбург',
    bio: 'Профессиональный гример с опытом работы в кино, театре и на телевидении. Специализируюсь на сложных образах, спецэффектах и исторических эпохах. Имею собственную студию и обширную коллекцию профессиональной косметики.',
    photo: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  {
    email: 'sergey.morozov@example.com',
    password: 'password123',
    firstName: 'Сергей',
    lastName: 'Морозов',
    profession: 'Монтажер',
    experience: 9,
    city: 'Новосибирск',
    bio: 'Опытный монтажер с хорошим чувством ритма и умением работать с различными жанрами. Владею программами Adobe Premiere Pro, Final Cut Pro и DaVinci Resolve. Мои работы отличаются качеством и стилем.',
    photo: ''
  },
  {
    email: 'natalya.volkova@example.com',
    password: 'password123',
    firstName: 'Наталья',
    lastName: 'Волкова',
    profession: 'Костюмер',
    experience: 12,
    city: 'Санкт-Петербург',
    bio: 'Костюмер с большим опытом работы. Разрабатываю и создаю костюмы для кино, рекламы и театра. Специализируюсь на исторических костюмах и сложных образах. Имею художественное образование и чувство стиля.',
    photo: 'https://randomuser.me/api/portraits/women/8.jpg'
  },
  {
    email: 'maxim.korolev@example.com',
    password: 'password123',
    firstName: 'Максим',
    lastName: 'Королев',
    profession: 'Звукорежиссер',
    experience: 7,
    city: 'Москва',
    bio: 'Звукорежиссер с опытом работы на крупных проектах. Отлично владею оборудованием для записи звука в студии и на площадке. Умею работать с шумами, музыкой и диалогами. Гарантирую качественный звук в любых условиях.',
    photo: 'https://randomuser.me/api/portraits/men/9.jpg'
  },
  {
    email: 'julia.sokolova@example.com',
    password: 'password123',
    firstName: 'Юлия',
    lastName: 'Соколова',
    profession: 'Художник-постановщик',
    experience: 10,
    city: 'Казань',
    bio: 'Художник-постановщик с опытом работы в кино и рекламе. Создаю визуальные концепции и декорации для фильмов и коммерческих проектов. Умею работать с ограниченным бюджетом и в сжатые сроки.',
    photo: ''
  },
  {
    email: 'andrey.sorokin@example.com',
    password: 'password123',
    firstName: 'Андрей',
    lastName: 'Сорокин',
    profession: 'Актер',
    experience: 3,
    city: 'Москва',
    bio: 'Молодой актер театра и кино. Обладаю яркой внешностью и хорошей физической подготовкой. Снимался в эпизодических ролях в сериалах и полнометражных фильмах. Готов к экспериментам и сложным ролям.',
    photo: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    email: 'ekaterina.petrova@example.com',
    password: 'password123',
    firstName: 'Екатерина',
    lastName: 'Петрова',
    profession: 'Кастинг-директор',
    experience: 8,
    city: 'Санкт-Петербург',
    bio: 'Кастинг-директор с опытом работы над крупными проектами. Имею обширную базу актеров и умею находить идеальные типажи для любых ролей. Организую кастинги быстро и эффективно.',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    email: 'pavel.kozlov@example.com',
    password: 'password123',
    firstName: 'Павел',
    lastName: 'Козлов',
    profession: 'Каскадер',
    experience: 15,
    city: 'Москва',
    bio: 'Профессиональный каскадер с многолетним опытом работы в кино. Выполняю трюки любой сложности, включая падения с высоты, автомобильные трюки и сцены с огнем. Имею спортивный разряд по нескольким видам спорта.',
    photo: 'https://randomuser.me/api/portraits/men/13.jpg'
  },
  {
    email: 'svetlana.orlova@example.com',
    password: 'password123',
    firstName: 'Светлана',
    lastName: 'Орлова',
    profession: 'Режиссер монтажа',
    experience: 7,
    city: 'Новосибирск',
    bio: 'Режиссер монтажа с творческим подходом к работе. Умею создавать увлекательные истории из отснятого материала, чувствую ритм и атмосферу. Работала над документальными фильмами, рекламой и музыкальными клипами.',
    photo: 'https://randomuser.me/api/portraits/women/14.jpg'
  },
  {
    email: 'igor.zaytsev@example.com',
    password: 'password123',
    firstName: 'Игорь',
    lastName: 'Зайцев',
    profession: 'Оператор',
    experience: 5,
    city: 'Екатеринбург',
    bio: 'Оператор с творческим видением и техническими навыками. Работаю с камерами RED, ARRI и Sony. Создаю красивые и атмосферные кадры. Открыт для проектов различных жанров и форматов.',
    photo: ''
  },
  {
    email: 'anna.fedorova@example.com',
    password: 'password123',
    firstName: 'Анна',
    lastName: 'Федорова',
    profession: 'Актриса',
    experience: 4,
    city: 'Казань',
    bio: 'Актриса театра и кино. Окончила театральный институт. Играла в театральных постановках различных жанров. Обладаю хорошими вокальными данными и пластикой. Быстро учу текст и вхожу в роль.',
    photo: 'https://randomuser.me/api/portraits/women/16.jpg'
  },
  {
    email: 'nikita.romanov@example.com',
    password: 'password123',
    firstName: 'Никита',
    lastName: 'Романов',
    profession: 'Режиссер',
    experience: 6,
    city: 'Москва',
    bio: 'Режиссер с опытом работы в независимом кино. Снял несколько короткометражных фильмов, получивших признание на фестивалях. Ищу новые проекты и возможности для творческой реализации.',
    photo: 'https://randomuser.me/api/portraits/men/17.jpg'
  },
  {
    email: 'veronika.lebedeva@example.com',
    password: 'password123',
    firstName: 'Вероника',
    lastName: 'Лебедева',
    profession: 'Гример',
    experience: 3,
    city: 'Санкт-Петербург',
    bio: 'Молодой и талантливый гример. Создаю как естественный макияж, так и сложные образы с использованием спецэффектов. Постоянно совершенствую свои навыки и слежу за новыми тенденциями.',
    photo: 'https://randomuser.me/api/portraits/women/18.jpg'
  },
  {
    email: 'vladimir.popov@example.com',
    password: 'password123',
    firstName: 'Владимир',
    lastName: 'Попов',
    profession: 'Сценарист',
    experience: 20,
    city: 'Москва',
    bio: 'Опытный сценарист с множеством реализованных проектов. Автор сценариев для полнометражных фильмов и сериалов. Специализируюсь на драмах и исторических фильмах. Умею работать в команде и под давлением сроков.',
    photo: 'https://randomuser.me/api/portraits/men/19.jpg'
  },
  {
    email: 'polina.vasileva@example.com',
    password: 'password123',
    firstName: 'Полина',
    lastName: 'Васильева',
    profession: 'Кастинг-директор',
    experience: 6,
    city: 'Новосибирск',
    bio: 'Кастинг-директор с опытом работы в кино и рекламе. Провожу кастинги профессионально и эффективно. Имею обширную базу актеров различных типажей и возрастов. Всегда нахожу идеальных кандидатов для проектов.',
    photo: ''
  },
  {
    email: 'anton.kuznetsov@example.com',
    password: 'password123',
    firstName: 'Антон',
    lastName: 'Кузнецов',
    profession: 'Продюсер',
    experience: 12,
    city: 'Екатеринбург',
    bio: 'Продюсер с опытом работы в телевидении и кино. Успешно реализовал несколько кинопроектов и сериалов. Умею работать с бюджетом и собирать команду профессионалов. Всегда открыт для интересных предложений.',
    photo: 'https://randomuser.me/api/portraits/men/21.jpg'
  },
  {
    email: 'karina.morozova@example.com',
    password: 'password123',
    firstName: 'Карина',
    lastName: 'Морозова',
    profession: 'Художник по костюмам',
    experience: 8,
    city: 'Москва',
    bio: 'Художник по костюмам с опытом работы в театре и кино. Создаю оригинальные костюмы, учитывая характер персонажа и эпоху. Умею работать с различными материалами и техниками. Мои работы отличаются вниманием к деталям.',
    photo: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    email: 'mikhail.alekseev@example.com',
    password: 'password123',
    firstName: 'Михаил',
    lastName: 'Алексеев',
    profession: 'Звукорежиссер',
    experience: 10,
    city: 'Казань',
    bio: 'Звукорежиссер с большим опытом работы. Записываю и обрабатываю звук для кино, телевидения и рекламы. Создаю атмосферный звук, который дополняет визуальный ряд. Имею собственное оборудование высокого класса.',
    photo: 'https://randomuser.me/api/portraits/men/23.jpg'
  },
  {
    email: 'alina.sidorova@example.com',
    password: 'password123',
    firstName: 'Алина',
    lastName: 'Сидорова',
    profession: 'Актриса',
    experience: 7,
    city: 'Санкт-Петербург',
    bio: 'Актриса театра и кино. Снималась в главных и второстепенных ролях в сериалах и полнометражных фильмах. Обладаю харизмой и умением перевоплощаться. Легко адаптируюсь к различным условиям съемок.',
    photo: ''
  },
  {
    email: 'leonid.borisov@example.com',
    password: 'password123',
    firstName: 'Леонид',
    lastName: 'Борисов',
    profession: 'Оператор',
    experience: 15,
    city: 'Москва',
    bio: 'Оператор-постановщик высшей категории. Работал над крупными проектами в кино и рекламе. Мастерски использую освещение и композицию для создания визуально привлекательных кадров. Имею собственное оборудование.',
    photo: 'https://randomuser.me/api/portraits/men/25.jpg'
  },
  {
    email: 'irina.dmitrieva@example.com',
    password: 'password123',
    firstName: 'Ирина',
    lastName: 'Дмитриева',
    profession: 'Монтажер',
    experience: 5,
    city: 'Новосибирск',
    bio: 'Монтажер с опытом работы в документальном кино и рекламе. Владею программами Adobe Premiere, After Effects и DaVinci Resolve. Умею структурировать материал и создавать логичное повествование.',
    photo: 'https://randomuser.me/api/portraits/women/26.jpg'
  },
  {
    email: 'denis.vinogradov@example.com',
    password: 'password123',
    firstName: 'Денис',
    lastName: 'Виноградов',
    profession: 'Режиссер',
    experience: 8,
    city: 'Екатеринбург',
    bio: 'Режиссер с опытом работы в телевидении и независимом кино. Снял несколько короткометражных и полнометражных фильмов. Умею работать с актерами и добиваться от них лучших результатов. Открыт для творческих экспериментов.',
    photo: 'https://randomuser.me/api/portraits/men/27.jpg'
  },
  {
    email: 'tatiana.zhuravleva@example.com',
    password: 'password123',
    firstName: 'Татьяна',
    lastName: 'Журавлева',
    profession: 'Сценарист',
    experience: 7,
    city: 'Москва',
    bio: 'Сценарист с опытом работы в телевидении и кино. Автор сценариев для сериалов и полнометражных фильмов. Умею писать увлекательные диалоги и создавать интересных персонажей. Работаю быстро и качественно.',
    photo: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
  {
    email: 'roman.makarov@example.com',
    password: 'password123',
    firstName: 'Роман',
    lastName: 'Макаров',
    profession: 'Продюсер',
    experience: 10,
    city: 'Казань',
    bio: 'Продюсер с опытом работы в кино и телевидении. Успешно запустил и реализовал несколько проектов различного масштаба. Умею эффективно планировать бюджет и находить финансирование. Всегда в поиске новых талантов и интересных идей.',
    photo: ''
  },
  {
    email: 'marina.grigorieva@example.com',
    password: 'password123',
    firstName: 'Марина',
    lastName: 'Григорьева',
    profession: 'Художник-постановщик',
    experience: 12,
    city: 'Санкт-Петербург',
    bio: 'Художник-постановщик с богатым опытом работы в кино и театре. Создаю визуальные концепции и декорации для фильмов различных жанров. Умею передать атмосферу эпохи через детали и цветовые решения. Люблю сложные и нестандартные задачи.',
    photo: 'https://randomuser.me/api/portraits/women/30.jpg'
  }
];

// Функция для создания пользователя и его резюме
async function createProfessional(db, professional) {
  try {
    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(professional.password, salt);
    
    // Создаем пользователя
    const userResult = await db.run(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [professional.email, passwordHash, professional.firstName, professional.lastName]
    );
    
    const userId = userResult.lastID;
    
    // Находим ID профессии
    const professionData = await db.get(
      'SELECT id, group_id FROM professions WHERE name = ?',
      [professional.profession]
    );
    
    if (!professionData) {
      console.error(`Профессия ${professional.profession} не найдена в базе данных`);
      return null;
    }
    
    // Находим ID города
    const cityData = await db.get(
      'SELECT id FROM cities WHERE city = ?',
      [professional.city]
    );
    
    if (!cityData) {
      console.error(`Город ${professional.city} не найден в базе данных`);
      return null;
    }
    
    // Вычисляем дату начала карьеры на основе опыта
    const now = new Date();
    const startYear = now.getFullYear() - professional.experience;
    const startMonth = now.getMonth() + 1;
    const since = `${startYear}-${startMonth.toString().padStart(2, '0')}-01`;
    
    // Создаем резюме
    const resumeResult = await db.run(
      `INSERT INTO resumes (owner_user_id, professions_id, city_id, biography, media_url, since) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, professionData.id, cityData.id, professional.bio, professional.photo, since]
    );
    
    console.log(`Создан профессионал: ${professional.firstName} ${professional.lastName}, ${professional.profession}`);
    return {
      userId,
      resumeId: resumeResult.lastID
    };
  } catch (error) {
    console.error(`Ошибка при создании профессионала ${professional.firstName} ${professional.lastName}:`, error);
    return null;
  }
}

// Главная функция для заполнения базы данных
async function seedProfessionals() {
  try {
    const db = await getDb();
    
    // Проверяем наличие необходимых таблиц
    const userTableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    const resumesTableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='resumes'");
    
    if (!userTableExists || !resumesTableExists) {
      console.error('Ошибка: Таблицы не существуют. Сначала инициализируйте базу данных.');
      return;
    }
    
    // Проверяем, есть ли уже пользователи с указанными email
    for (const professional of professionals) {
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [professional.email]);
      
      if (existingUser) {
        console.log(`Пользователь с email ${professional.email} уже существует, пропускаем...`);
      } else {
        await createProfessional(db, professional);
      }
    }
    
    console.log('Заполнение базы данных специалистами завершено!');
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  }
}

// Запускаем заполнение базы данных
seedProfessionals()
  .then(() => {
    console.log('Скрипт выполнен успешно');
    process.exit(0);
  })
  .catch(err => {
    console.error('Ошибка выполнения скрипта:', err);
    process.exit(1);
  }); 