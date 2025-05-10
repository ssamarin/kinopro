import express from 'express';
import { getDb } from '../db.js';
import { updateProfileStatus } from '../models/user.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Получение всех городов
router.get('/cities', async (req, res) => {
  try {
    const db = await getDb();
    const cities = await db.all('SELECT * FROM cities ORDER BY city');
    res.json(cities);
  } catch (error) {
    console.error('Ошибка при получении списка городов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение всех групп профессий
router.get('/profession-groups', async (req, res) => {
  try {
    const db = await getDb();
    const groups = await db.all('SELECT * FROM profession_groups ORDER BY name');
    res.json(groups);
  } catch (error) {
    console.error('Ошибка при получении групп профессий:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение всех профессий
router.get('/professions', async (req, res) => {
  try {
    const db = await getDb();
    const professions = await db.all('SELECT * FROM professions ORDER BY name');
    res.json(professions);
  } catch (error) {
    console.error('Ошибка при получении профессий:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение профессий по группе
router.get('/professions/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const db = await getDb();
    const professions = await db.all(
      'SELECT * FROM professions WHERE group_id = ? ORDER BY name',
      groupId
    );
    res.json(professions);
  } catch (error) {
    console.error('Ошибка при получении профессий по группе:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение резюме по ID пользователя
router.get('/resumes/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await getDb();
    const resume = await db.get('SELECT * FROM resumes WHERE owner_user_id = ?', userId);
    
    if (!resume) {
      return res.status(404).json({ error: 'Резюме не найдено' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Ошибка при получении резюме:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание нового резюме
router.post('/resumes', async (req, res) => {
  try {
    const { owner_user_id, professions_id, city_id, biography, media_url, experience_years } = req.body;
    
    if (!owner_user_id || !professions_id || !city_id) {
      return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    
    const db = await getDb();
    
    // Проверяем, существует ли уже резюме для этого пользователя
    const existingResume = await db.get('SELECT * FROM resumes WHERE owner_user_id = ?', owner_user_id);
    if (existingResume) {
      return res.status(409).json({ error: 'Резюме для этого пользователя уже существует' });
    }
    
    // Вычисляем дату начала карьеры на основе experience_years
    let since = null;
    if (experience_years !== undefined && experience_years !== null) {
      const now = new Date();
      const startYear = now.getFullYear() - experience_years;
      const startMonth = now.getMonth() + 1;
      since = `${startYear}-${startMonth.toString().padStart(2, '0')}-01`;
    }
    
    const result = await db.run(
      `INSERT INTO resumes (owner_user_id, professions_id, city_id, biography, media_url, since) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [owner_user_id, professions_id, city_id, biography, media_url, since]
    );
    
    // Обновляем статус пользователя на "профиль заполнен" (1)
    await updateProfileStatus(owner_user_id, 1);
    
    // Получаем созданное резюме с дополнительной информацией
    const newResume = await db.get(`
      SELECT 
        r.*,
        p.name as profession_name,
        pg.name as profession_group_name,
        c.city as city_name
      FROM resumes r
      LEFT JOIN professions p ON r.professions_id = p.id
      LEFT JOIN profession_groups pg ON p.group_id = pg.id
      LEFT JOIN cities c ON r.city_id = c.id
      WHERE r.id = ?
    `, result.lastID);
    
    res.status(201).json({
      id: newResume.id,
      owner_user_id: newResume.owner_user_id,
      professions_id: newResume.professions_id,
      professionId: newResume.professions_id,
      profession_name: newResume.profession_name,
      professionName: newResume.profession_name,
      profession_group_name: newResume.profession_group_name,
      professionGroupName: newResume.profession_group_name,
      city_id: newResume.city_id,
      cityId: newResume.city_id,
      city_name: newResume.city_name,
      cityName: newResume.city_name,
      biography: newResume.biography,
      media_url: newResume.media_url,
      mediaUrl: newResume.media_url,
      since: newResume.since,
      experience_years: experience_years,
      experienceYears: experience_years
    });
  } catch (error) {
    console.error('Ошибка при создании резюме:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление существующего резюме
router.put('/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { professions_id, city_id, biography, media_url, experience_years } = req.body;
    
    if (!professions_id || !city_id) {
      return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    
    const db = await getDb();
    
    // Проверяем, существует ли резюме
    const existingResume = await db.get('SELECT * FROM resumes WHERE id = ?', id);
    if (!existingResume) {
      return res.status(404).json({ error: 'Резюме не найдено' });
    }
    
    // Вычисляем дату начала карьеры на основе experience_years, если он передан
    let since = existingResume.since;
    if (experience_years !== undefined && experience_years !== null) {
      const now = new Date();
      const startYear = now.getFullYear() - experience_years;
      const startMonth = now.getMonth() + 1;
      since = `${startYear}-${startMonth.toString().padStart(2, '0')}-01`;
    }
    
    await db.run(
      `UPDATE resumes 
       SET professions_id = ?, city_id = ?, biography = ?, media_url = ?, since = ? 
       WHERE id = ?`,
      [professions_id, city_id, biography, media_url, since, id]
    );
    
    // Получаем обновленное резюме с дополнительной информацией
    const updatedResume = await db.get(`
      SELECT 
        r.*,
        p.name as profession_name,
        pg.name as profession_group_name,
        c.city as city_name
      FROM resumes r
      LEFT JOIN professions p ON r.professions_id = p.id
      LEFT JOIN profession_groups pg ON p.group_id = pg.id
      LEFT JOIN cities c ON r.city_id = c.id
      WHERE r.id = ?
    `, id);
    
    // Вычисляем опыт работы в годах
    let experienceYears = experience_years;
    if (!experienceYears && updatedResume.since) {
      const startDate = new Date(updatedResume.since);
      const now = new Date();
      experienceYears = now.getFullYear() - startDate.getFullYear();
      
      // Корректируем, если текущая дата еще не достигла даты годовщины в этом году
      if (
        now.getMonth() < startDate.getMonth() || 
        (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())
      ) {
        experienceYears--;
      }
    }
    
    res.json({
      id: updatedResume.id,
      owner_user_id: updatedResume.owner_user_id,
      professions_id: updatedResume.professions_id,
      professionId: updatedResume.professions_id,
      profession_name: updatedResume.profession_name,
      professionName: updatedResume.profession_name,
      profession_group_name: updatedResume.profession_group_name,
      professionGroupName: updatedResume.profession_group_name,
      city_id: updatedResume.city_id,
      cityId: updatedResume.city_id,
      city_name: updatedResume.city_name,
      cityName: updatedResume.city_name,
      biography: updatedResume.biography,
      media_url: updatedResume.media_url,
      mediaUrl: updatedResume.media_url,
      since: updatedResume.since,
      experience_years: experienceYears,
      experienceYears: experienceYears
    });
  } catch (error) {
    console.error('Ошибка при обновлении резюме:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для обновления только даты начала карьеры (since)
router.put('/resumes/:id/experience', async (req, res) => {
  try {
    const { id } = req.params;
    const { experience_years } = req.body;
    
    if (experience_years === undefined || experience_years === null) {
      return res.status(400).json({ error: 'Опыт работы должен быть указан' });
    }
    
    const db = await getDb();
    
    // Проверяем, существует ли резюме
    const existingResume = await db.get('SELECT * FROM resumes WHERE id = ?', id);
    if (!existingResume) {
      return res.status(404).json({ error: 'Резюме не найдено' });
    }
    
    // Вычисляем дату начала карьеры на основе experience_years
    const now = new Date();
    const startYear = now.getFullYear() - experience_years;
    const startMonth = now.getMonth() + 1;
    const since = `${startYear}-${startMonth.toString().padStart(2, '0')}-01`;
    
    await db.run('UPDATE resumes SET since = ? WHERE id = ?', [since, id]);
    
    // Получаем обновленное резюме с дополнительной информацией
    const updatedResume = await db.get(`
      SELECT 
        r.*,
        p.name as profession_name,
        pg.name as profession_group_name,
        c.city as city_name
      FROM resumes r
      LEFT JOIN professions p ON r.professions_id = p.id
      LEFT JOIN profession_groups pg ON p.group_id = pg.id
      LEFT JOIN cities c ON r.city_id = c.id
      WHERE r.id = ?
    `, id);
    
    res.json({
      id: updatedResume.id,
      since: updatedResume.since,
      experience_years: experience_years,
      experienceYears: experience_years,
      owner_user_id: updatedResume.owner_user_id,
      professions_id: updatedResume.professions_id,
      professionId: updatedResume.professions_id,
      profession_name: updatedResume.profession_name,
      professionName: updatedResume.profession_name,
      profession_group_name: updatedResume.profession_group_name,
      professionGroupName: updatedResume.profession_group_name,
      city_id: updatedResume.city_id,
      cityId: updatedResume.city_id,
      city_name: updatedResume.city_name,
      cityName: updatedResume.city_name,
      biography: updatedResume.biography,
      media_url: updatedResume.media_url,
      mediaUrl: updatedResume.media_url
    });
  } catch (error) {
    console.error('Ошибка при обновлении опыта работы:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение списка профессионалов с фильтрацией
router.get('/professionals', optionalAuth, async (req, res) => {
  try {
    const { 
      professionId, 
      professionGroupId, 
      cityId, 
      experienceFrom, 
      experienceTo, 
      ratingFrom, 
      ratingTo,
      search
    } = req.query;
    
    // Получаем ID пользователя из токена, если он есть
    const userId = req.userId;
    
    const db = await getDb();
    
    // Проверяем статус пользователя, если есть userId
    let userStatus = 1; // По умолчанию считаем, что профиль заполнен
    if (userId) {
      const user = await db.get('SELECT profile_complete_status FROM users WHERE id = ?', userId);
      if (user) {
        userStatus = user.profile_complete_status;
      }
    }
    
    // Базовый запрос
    let query = `
      SELECT 
        r.id as resume_id,
        r.owner_user_id,
        u.email,
        u.first_name,
        u.last_name,
        r.professions_id,
        p.name as profession_name,
        pg.id as profession_group_id,
        pg.name as profession_group_name,
        r.city_id,
        c.city as city_name,
        r.biography,
        r.media_url,
        r.feedback_ids,
        r.since
      FROM resumes r
      JOIN users u ON r.owner_user_id = u.id
      JOIN professions p ON r.professions_id = p.id
      JOIN profession_groups pg ON p.group_id = pg.id
      JOIN cities c ON r.city_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Применяем фильтры только если пользователь имеет заполненный профиль (status = 1)
    if (userStatus === 1) {
      // Применяем фильтры
      if (professionId) {
        query += " AND r.professions_id = ?";
        params.push(professionId);
      }
      
      if (professionGroupId) {
        query += " AND pg.id = ?";
        params.push(professionGroupId);
      }
      
      if (cityId) {
        query += " AND r.city_id = ?";
        params.push(cityId);
      }
      
      // Поиск по имени или профессии
      if (search) {
        query += " AND (u.first_name LIKE ? OR u.last_name LIKE ? OR p.name LIKE ?)";
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
      }
    }
    
    // Получаем список профессионалов
    const professionals = await db.all(query, params);
    
    // Получаем все отзывы для всех профессионалов
    const userIds = professionals.map(pro => pro.owner_user_id);
    let reviews = [];
    
    if (userIds.length > 0) {
      const placeholders = userIds.map(() => '?').join(',');
      reviews = await db.all(`
        SELECT reviewed_user_id, rating
        FROM reviews
        WHERE reviewed_user_id IN (${placeholders})
      `, userIds);
    }
    
    // Группируем отзывы по пользователям и вычисляем средний рейтинг
    const ratingsMap = {};
    reviews.forEach(review => {
      if (!ratingsMap[review.reviewed_user_id]) {
        ratingsMap[review.reviewed_user_id] = {
          sum: 0,
          count: 0
        };
      }
      ratingsMap[review.reviewed_user_id].sum += review.rating;
      ratingsMap[review.reviewed_user_id].count += 1;
    });
    
    // Форматируем данные для фронтенда
    let formattedProfessionals = professionals.map(pro => {
      // Формируем имя на основе данных из БД или email
      let name;
      if (pro.first_name || pro.last_name) {
        name = [pro.first_name, pro.last_name].filter(Boolean).join(' ');
      } else {
        const nameParts = pro.email.split('@')[0].split('.');
        name = nameParts.length > 1 
          ? `${nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)} ${nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)}`
          : nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      }
      
      // Получаем рейтинг из отзывов
      let rating = null;
      const userRatings = ratingsMap[pro.owner_user_id];
      if (userRatings && userRatings.count > 0) {
        rating = parseFloat((userRatings.sum / userRatings.count).toFixed(1));
      }
      
      // Вычисляем опыт работы на основе поля since, если оно задано
      let experience;
      let years;
      
      if (pro.since) {
        const startDate = new Date(pro.since);
        const now = new Date();
        years = now.getFullYear() - startDate.getFullYear();
        
        // Корректируем, если текущая дата еще не достигла даты годовщины в этом году
        if (
          now.getMonth() < startDate.getMonth() || 
          (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())
        ) {
          years--;
        }
      } else {
        // Заглушка, если поле since не задано
        years = Math.floor(Math.random() * 20) + 1;
      }
      
      if (years === 1) experience = `${years} год`;
      else if (years >= 2 && years <= 4) experience = `${years} года`;
      else experience = `${years} лет`;
      
      return {
        id: pro.resume_id,
        userId: pro.owner_user_id,
        name,
        profession: pro.profession_name,
        professionId: pro.professions_id,
        professionGroup: pro.profession_group_name,
        professionGroupId: pro.profession_group_id,
        rating,
        experience,
        experienceYears: years,
        since: pro.since,
        location: pro.city_name,
        cityId: pro.city_id,
        photo: pro.media_url || null,
        biography: pro.biography,
        hasFeedback: !!ratingsMap[pro.owner_user_id]
      };
    });
    
    // Применяем фильтры для вычисляемых полей только если пользователь имеет заполненный профиль
    if (userStatus === 1) {
      // Применяем фильтры для вычисляемых полей (опыт работы и рейтинг)
      if (experienceFrom) {
        formattedProfessionals = formattedProfessionals.filter(pro => 
          pro.experienceYears >= parseInt(experienceFrom)
        );
      }
      
      if (experienceTo) {
        formattedProfessionals = formattedProfessionals.filter(pro => 
          pro.experienceYears <= parseInt(experienceTo)
        );
      }
      
      if (ratingFrom) {
        const minRating = parseFloat(ratingFrom);
        formattedProfessionals = formattedProfessionals.filter(pro => {
          // Если минимальный рейтинг > 0, исключаем карточки с null или 0 рейтингом
          if (minRating > 0 && (pro.rating === null || pro.rating === 0)) {
            return false;
          }
          // Проверяем нижнюю границу рейтинга (только для не-null значений)
          return pro.rating === null || pro.rating >= minRating;
        });
      }
      
      if (ratingTo) {
        formattedProfessionals = formattedProfessionals.filter(pro => 
          pro.rating === null || pro.rating <= parseFloat(ratingTo)
        );
      }
    } else {
      // Для пользователей с незаполненным профилем ограничиваем список до 10 профессионалов
      formattedProfessionals = formattedProfessionals.slice(0, 10);
    }
    
    // Возвращаем также информацию о статусе пользователя для фронтенда
    res.json({
      professionals: formattedProfessionals,
      filtersEnabled: userStatus === 1,
      totalCount: formattedProfessionals.length
    });
  } catch (error) {
    console.error('Ошибка при получении специалистов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение данных одного специалиста по ID резюме
router.get('/professionals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    
    // Получаем данные специалиста по ID резюме
    const professional = await db.get(`
      SELECT 
        r.id as resume_id,
        r.owner_user_id,
        u.email,
        u.first_name,
        u.last_name,
        r.professions_id,
        p.name as profession_name,
        pg.id as profession_group_id,
        pg.name as profession_group_name,
        r.city_id,
        c.city as city_name,
        r.biography,
        r.media_url,
        r.feedback_ids,
        r.since
      FROM resumes r
      JOIN users u ON r.owner_user_id = u.id
      JOIN professions p ON r.professions_id = p.id
      JOIN profession_groups pg ON p.group_id = pg.id
      JOIN cities c ON r.city_id = c.id
      WHERE r.id = ?
    `, id);
    
    if (!professional) {
      return res.status(404).json({ error: 'Специалист не найден' });
    }
    
    // Формируем имя на основе данных из БД или email
    let name;
    if (professional.first_name || professional.last_name) {
      name = [professional.first_name, professional.last_name].filter(Boolean).join(' ');
    } else {
      const nameParts = professional.email.split('@')[0].split('.');
      name = nameParts.length > 1 
        ? `${nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)} ${nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)}`
        : nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
    }
    
    // Получаем отзывы для этого пользователя
    const reviews = await db.all(`
      SELECT 
        r.id, 
        r.rating, 
        r.text, 
        r.reviewed_user_id, 
        r.reviewer_user_id, 
        r.created_at,
        u.first_name as reviewer_first_name,
        u.last_name as reviewer_last_name
      FROM reviews r
      JOIN users u ON r.reviewer_user_id = u.id
      WHERE r.reviewed_user_id = ?
      ORDER BY r.created_at DESC
    `, professional.owner_user_id);
    
    // Вычисляем средний рейтинг на основе отзывов
    let rating = null;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      rating = parseFloat((sum / reviews.length).toFixed(1));
    }
    
    // Форматируем отзывы для ответа
    const formattedReviews = reviews.map(review => {
      let reviewerName = 'Пользователь';
      if (review.reviewer_first_name || review.reviewer_last_name) {
        reviewerName = [review.reviewer_first_name, review.reviewer_last_name].filter(Boolean).join(' ');
      }
      
      return {
        id: review.id,
        rating: review.rating,
        text: review.text,
        reviewerName,
        createdAt: review.created_at
      };
    });
    
    // Вычисляем опыт работы
    let experience;
    let years;
    
    if (professional.since) {
      const startDate = new Date(professional.since);
      const now = new Date();
      years = now.getFullYear() - startDate.getFullYear();
      
      if (
        now.getMonth() < startDate.getMonth() || 
        (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())
      ) {
        years--;
      }
    } else {
      years = Math.floor(Math.random() * 20) + 1;
    }
    
    if (years === 1) experience = `${years} год`;
    else if (years >= 2 && years <= 4) experience = `${years} года`;
    else experience = `${years} лет`;
    
    // Формируем итоговый объект
    const formattedProfessional = {
      id: professional.resume_id,
      userId: professional.owner_user_id,
      name,
      firstName: professional.first_name || '',
      lastName: professional.last_name || '',
      email: professional.email,
      profession: professional.profession_name,
      professionId: professional.professions_id,
      professionGroup: professional.profession_group_name,
      professionGroupId: professional.profession_group_id,
      rating,
      reviews: formattedReviews,
      reviewsCount: reviews.length,
      experience,
      experienceYears: years,
      since: professional.since,
      location: professional.city_name,
      cityId: professional.city_id,
      photo: professional.media_url || null,
      biography: professional.biography || '',
      hasFeedback: reviews.length > 0,
      portfolioProjects: [] // В будущем здесь можно добавить проекты
    };
    
    res.json(formattedProfessional);
  } catch (error) {
    console.error('Ошибка при получении данных специалиста:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router; 