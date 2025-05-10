import { getDb } from '../db.js';

/**
 * Получение всех отзывов для конкретного пользователя
 * @param {number} userId - ID пользователя, для которого нужно получить отзывы
 * @returns {Promise<Array>} - Массив отзывов
 */
export async function getReviewsByUserId(userId) {
  try {
    const db = await getDb();
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
    `, [userId]);
    
    return reviews;
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
    throw error;
  }
}

/**
 * Создание нового отзыва
 * @param {Object} reviewData - Данные отзыва
 * @param {number} reviewData.rating - Оценка от 0 до 5 с шагом 0.5
 * @param {string} reviewData.text - Текст отзыва
 * @param {number} reviewData.reviewed_user_id - ID пользователя, которому ставят отзыв
 * @param {number} reviewData.reviewer_user_id - ID пользователя, который ставит отзыв
 * @returns {Promise<Object>} - Созданный отзыв
 */
export async function createReview(reviewData) {
  try {
    const { rating, text, reviewed_user_id, reviewer_user_id } = reviewData;
    
    // Проверка валидности рейтинга
    if (rating < 0 || rating > 5 || (rating * 2) % 1 !== 0) {
      throw new Error('Рейтинг должен быть от 0 до 5 с шагом 0.5');
    }
    
    const db = await getDb();
    
    // Проверяем, существует ли уже отзыв от этого пользователя
    const existingReview = await db.get(
      'SELECT id FROM reviews WHERE reviewer_user_id = ? AND reviewed_user_id = ?',
      [reviewer_user_id, reviewed_user_id]
    );
    
    if (existingReview) {
      throw new Error('Вы уже оставляли отзыв для этого пользователя');
    }
    
    const result = await db.run(
      `INSERT INTO reviews (rating, text, reviewed_user_id, reviewer_user_id) 
       VALUES (?, ?, ?, ?)`,
      [rating, text, reviewed_user_id, reviewer_user_id]
    );
    
    const newReview = await db.get('SELECT * FROM reviews WHERE id = ?', result.lastID);
    return newReview;
  } catch (error) {
    console.error('Ошибка при создании отзыва:', error);
    throw error;
  }
}

/**
 * Обновление существующего отзыва
 * @param {number} reviewId - ID отзыва
 * @param {Object} reviewData - Обновленные данные отзыва
 * @param {number} reviewData.rating - Оценка от 0 до 5 с шагом 0.5
 * @param {string} reviewData.text - Текст отзыва
 * @returns {Promise<Object>} - Обновленный отзыв
 */
export async function updateReview(reviewId, reviewData) {
  try {
    const { rating, text } = reviewData;
    
    // Проверка валидности рейтинга
    if (rating < 0 || rating > 5 || (rating * 2) % 1 !== 0) {
      throw new Error('Рейтинг должен быть от 0 до 5 с шагом 0.5');
    }
    
    const db = await getDb();
    
    // Проверяем, существует ли отзыв
    const existingReview = await db.get('SELECT * FROM reviews WHERE id = ?', reviewId);
    if (!existingReview) {
      throw new Error('Отзыв не найден');
    }
    
    await db.run(
      'UPDATE reviews SET rating = ?, text = ? WHERE id = ?',
      [rating, text, reviewId]
    );
    
    const updatedReview = await db.get('SELECT * FROM reviews WHERE id = ?', reviewId);
    return updatedReview;
  } catch (error) {
    console.error('Ошибка при обновлении отзыва:', error);
    throw error;
  }
}

/**
 * Удаление отзыва
 * @param {number} reviewId - ID отзыва
 * @returns {Promise<boolean>} - Результат удаления
 */
export async function deleteReview(reviewId) {
  try {
    const db = await getDb();
    
    // Проверяем, существует ли отзыв
    const existingReview = await db.get('SELECT * FROM reviews WHERE id = ?', reviewId);
    if (!existingReview) {
      throw new Error('Отзыв не найден');
    }
    
    await db.run('DELETE FROM reviews WHERE id = ?', reviewId);
    return true;
  } catch (error) {
    console.error('Ошибка при удалении отзыва:', error);
    throw error;
  }
}

/**
 * Получение среднего рейтинга пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<number|null>} - Средний рейтинг или null, если отзывов нет
 */
export async function getUserAverageRating(userId) {
  try {
    const db = await getDb();
    const result = await db.get(
      'SELECT AVG(rating) as average_rating FROM reviews WHERE reviewed_user_id = ?',
      [userId]
    );
    
    return result.average_rating !== null ? parseFloat(result.average_rating.toFixed(1)) : null;
  } catch (error) {
    console.error('Ошибка при получении среднего рейтинга:', error);
    throw error;
  }
} 