import express from 'express';
import { 
  getParticipantsByUserId, 
  getParticipantById, 
  createParticipant, 
  updateParticipant, 
  deleteParticipant,
  addProfessionalToList,
  removeProfessionalFromList
} from '../models/participant.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Получение всех списков избранного для текущего пользователя
router.get('/participants', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const lists = await getParticipantsByUserId(userId);
    
    res.json(lists);
  } catch (error) {
    console.error('Ошибка при получении списков избранного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение списка избранного по ID
router.get('/participants/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const list = await getParticipantById(id);
    
    if (!list) {
      return res.status(404).json({ error: 'Список не найден' });
    }
    
    // Проверяем, принадлежит ли список текущему пользователю
    if (list.owner_user_id !== req.userId) {
      return res.status(403).json({ error: 'У вас нет прав на просмотр этого списка' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Ошибка при получении списка избранного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание нового списка избранного
router.post('/participants', verifyToken, async (req, res) => {
  try {
    const { title, description, list_of_ids } = req.body;
    const owner_user_id = req.userId;
    
    // Проверяем обязательные поля
    if (!title) {
      return res.status(400).json({ error: 'Название списка обязательно' });
    }
    
    // Если list_of_ids не передан, создаем пустой массив
    const ids = list_of_ids || [];
    
    const newList = await createParticipant({
      title,
      description,
      list_of_ids: ids,
      owner_user_id
    });
    
    res.status(201).json(newList);
  } catch (error) {
    console.error('Ошибка при создании списка избранного:', error);
    
    if (error.message === 'Некорректные данные для создания списка') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление существующего списка избранного
router.put('/participants/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, list_of_ids } = req.body;
    
    // Проверяем, существует ли список и принадлежит ли он текущему пользователю
    const existingList = await getParticipantById(id);
    if (!existingList) {
      return res.status(404).json({ error: 'Список не найден' });
    }
    
    if (existingList.owner_user_id !== req.userId) {
      return res.status(403).json({ error: 'У вас нет прав на редактирование этого списка' });
    }
    
    const updatedList = await updateParticipant(id, {
      title,
      description,
      list_of_ids
    });
    
    res.json(updatedList);
  } catch (error) {
    console.error('Ошибка при обновлении списка избранного:', error);
    
    if (error.message === 'Список не найден' || error.message === 'list_of_ids должен быть массивом' || error.message === 'Нет данных для обновления') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление списка избранного
router.delete('/participants/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем, существует ли список и принадлежит ли он текущему пользователю
    const existingList = await getParticipantById(id);
    if (!existingList) {
      return res.status(404).json({ error: 'Список не найден' });
    }
    
    if (existingList.owner_user_id !== req.userId) {
      return res.status(403).json({ error: 'У вас нет прав на удаление этого списка' });
    }
    
    await deleteParticipant(id);
    
    res.json({ message: 'Список успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении списка избранного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление профессионала в список избранного
router.post('/participants/:id/professionals/:professionalId', verifyToken, async (req, res) => {
  try {
    const { id, professionalId } = req.params;
    
    // Проверяем, существует ли список и принадлежит ли он текущему пользователю
    const existingList = await getParticipantById(id);
    if (!existingList) {
      return res.status(404).json({ error: 'Список не найден' });
    }
    
    if (existingList.owner_user_id !== req.userId) {
      return res.status(403).json({ error: 'У вас нет прав на редактирование этого списка' });
    }
    
    const updatedList = await addProfessionalToList(id, parseInt(professionalId));
    
    res.json(updatedList);
  } catch (error) {
    console.error('Ошибка при добавлении профессионала в список:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление профессионала из списка избранного
router.delete('/participants/:id/professionals/:professionalId', verifyToken, async (req, res) => {
  try {
    const { id, professionalId } = req.params;
    
    // Проверяем, существует ли список и принадлежит ли он текущему пользователю
    const existingList = await getParticipantById(id);
    if (!existingList) {
      return res.status(404).json({ error: 'Список не найден' });
    }
    
    if (existingList.owner_user_id !== req.userId) {
      return res.status(403).json({ error: 'У вас нет прав на редактирование этого списка' });
    }
    
    const updatedList = await removeProfessionalFromList(id, parseInt(professionalId));
    
    res.json(updatedList);
  } catch (error) {
    console.error('Ошибка при удалении профессионала из списка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router; 