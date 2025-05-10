import express from 'express';
import { getReviewsByUserId, createReview, updateReview, deleteReview, getUserAverageRating } from '../models/review.js';
import { verifyToken } from '../middleware/auth.js';
import { getDb } from '../db.js';

const router = express.Router();

// Получение всех отзывов для конкретного пользователя
router.get('/users/:userId/reviews', async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await getReviewsByUserId(userId);
    
    // Форматируем имена рецензентов
    const formattedReviews = reviews.map(review => {
      let reviewerName = 'Пользователь';
      if (review.reviewer_first_name || review.reviewer_last_name) {
        reviewerName = [review.reviewer_first_name, review.reviewer_last_name].filter(Boolean).join(' ');
      }
      
      return {
        id: review.id,
        rating: review.rating,
        text: review.text,
        reviewedUserId: review.reviewed_user_id,
        reviewerUserId: review.reviewer_user_id,
        reviewerName,
        createdAt: review.created_at
      };
    });
    
    res.json(formattedReviews);
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение среднего рейтинга пользователя
router.get('/users/:userId/rating', async (req, res) => {
  try {
    const { userId } = req.params;
    const averageRating = await getUserAverageRating(userId);
    
    res.json({ userId, averageRating });
  } catch (error) {
    console.error('Ошибка при получении среднего рейтинга:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание нового отзыва (требуется аутентификация)
router.post('/reviews', verifyToken, async (req, res) => {
  try {
    const { rating, text, reviewed_user_id } = req.body;
    const reviewer_user_id = req.userId;
    
    // Проверяем, что пользователь не оставляет отзыв самому себе
    if (reviewer_user_id === parseInt(reviewed_user_id)) {
      return res.status(400).json({ error: 'Нельзя оставить отзыв самому себе' });
    }
    
    // Проверяем, что все необходимые поля предоставлены
    if (!rating || !reviewed_user_id) {
      return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    
    const reviewData = {
      rating: parseFloat(rating),
      text,
      reviewed_user_id,
      reviewer_user_id
    };
    
    const newReview = await createReview(reviewData);
    
    res.status(201).json({
      id: newReview.id,
      rating: newReview.rating,
      text: newReview.text,
      reviewedUserId: newReview.reviewed_user_id,
      reviewerUserId: newReview.reviewer_user_id,
      createdAt: newReview.created_at
    });
  } catch (error) {
    console.error('Ошибка при создании отзыва:', error);
    
    if (error.message === 'Вы уже оставляли отзыв для этого пользователя' || 
        error.message === 'Рейтинг должен быть от 0 до 5 с шагом 0.5') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление существующего отзыва (требуется аутентификация)
router.put('/reviews/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;
    const userId = req.userId;
    
    // Проверяем, что все необходимые поля предоставлены
    if (!rating) {
      return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    
    // Проверяем, что пользователь является автором отзыва
    const db = await getDb();
    const review = await db.get('SELECT * FROM reviews WHERE id = ?', id);
    
    if (!review) {
      return res.status(404).json({ error: 'Отзыв не найден' });
    }
    
    if (review.reviewer_user_id !== userId) {
      return res.status(403).json({ error: 'У вас нет прав на редактирование этого отзыва' });
    }
    
    const reviewData = {
      rating: parseFloat(rating),
      text
    };
    
    const updatedReview = await updateReview(id, reviewData);
    
    res.json({
      id: updatedReview.id,
      rating: updatedReview.rating,
      text: updatedReview.text,
      reviewedUserId: updatedReview.reviewed_user_id,
      reviewerUserId: updatedReview.reviewer_user_id,
      createdAt: updatedReview.created_at
    });
  } catch (error) {
    console.error('Ошибка при обновлении отзыва:', error);
    
    if (error.message === 'Отзыв не найден' || 
        error.message === 'Рейтинг должен быть от 0 до 5 с шагом 0.5') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление отзыва (требуется аутентификация)
router.delete('/reviews/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Проверяем, что пользователь является автором отзыва
    const db = await getDb();
    const review = await db.get('SELECT * FROM reviews WHERE id = ?', id);
    
    if (!review) {
      return res.status(404).json({ error: 'Отзыв не найден' });
    }
    
    if (review.reviewer_user_id !== userId) {
      return res.status(403).json({ error: 'У вас нет прав на удаление этого отзыва' });
    }
    
    await deleteReview(id);
    
    res.json({ message: 'Отзыв успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении отзыва:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router; 