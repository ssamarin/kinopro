import express from 'express';
import { getDb } from '../db.js';
import { findUserByEmail, updateUserNames } from '../models/user.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Маршрут для получения данных текущего пользователя
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    const db = await getDb();
    
    // Получаем данные пользователя
    const user = await db.get('SELECT id, email, first_name, last_name FROM users WHERE id = ?', userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    // Получаем резюме пользователя, если оно существует
    const resume = await db.get(`
      SELECT 
        r.*,
        p.name as profession_name,
        pg.name as profession_group_name,
        c.city as city_name
      FROM resumes r
      LEFT JOIN professions p ON r.professions_id = p.id
      LEFT JOIN profession_groups pg ON p.group_id = pg.id
      LEFT JOIN cities c ON r.city_id = c.id
      WHERE r.owner_user_id = ?
    `, userId);
    
    // Преобразуем since в experience_years, если есть
    let experienceYears = null;
    if (resume && resume.since) {
      const startDate = new Date(resume.since);
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
    
    // Формируем ответ
    const response = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      resume: resume ? {
        id: resume.id,
        // Используем оба варианта имен полей для совместимости
        professions_id: resume.professions_id,
        professionId: resume.professions_id,
        profession_name: resume.profession_name,
        professionName: resume.profession_name,
        profession_group_name: resume.profession_group_name,
        professionGroupName: resume.profession_group_name,
        city_id: resume.city_id,
        cityId: resume.city_id,
        city_name: resume.city_name,
        cityName: resume.city_name,
        biography: resume.biography,
        media_url: resume.media_url,
        mediaUrl: resume.media_url,
        since: resume.since,
        experienceYears: experienceYears,
        experience_years: experienceYears
      } : null
    };
    
    // Добавляем отладочную информацию в консоль
    console.log('Отправляем данные профиля:', response);
    
    res.json(response);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({ error: 'Ошибка при получении профиля', details: error.message });
  }
});

// Маршрут для обновления имени и фамилии пользователя
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName } = req.body;
    
    if (firstName === undefined && lastName === undefined) {
      return res.status(400).json({ error: 'Имя или фамилия должны быть указаны' });
    }
    
    // Используем обновленную функцию updateUserNames из модели пользователя
    const updatedUser = await updateUserNames(userId, firstName, lastName);
    
    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName
    });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    
    // Определяем тип ошибки и возвращаем соответствующий код статуса
    if (error.message && error.message.includes('не найден')) {
      return res.status(404).json({ error: 'Пользователь не найден', details: error.message });
    } else if (error.message && error.message.includes('Не удалось обновить')) {
      return res.status(400).json({ error: 'Не удалось обновить профиль', details: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка при обновлении профиля', details: error.message });
  }
});

export default router; 