import { getDb } from '../db.js';

/**
 * Получение всех списков избранного для конкретного пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<Array>} - Массив списков избранного
 */
export async function getParticipantsByUserId(userId) {
  try {
    const db = await getDb();
    const lists = await db.all(
      'SELECT * FROM participants WHERE owner_user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Преобразуем строку JSON в массив для каждого списка
    return lists.map(list => ({
      ...list,
      list_of_ids: JSON.parse(list.list_of_ids)
    }));
  } catch (error) {
    console.error('Ошибка при получении списков избранного:', error);
    throw error;
  }
}

/**
 * Получение списка избранного по ID
 * @param {number} listId - ID списка
 * @returns {Promise<Object|null>} - Список избранного или null, если не найден
 */
export async function getParticipantById(listId) {
  try {
    const db = await getDb();
    const list = await db.get('SELECT * FROM participants WHERE id = ?', [listId]);
    
    if (!list) {
      return null;
    }
    
    // Преобразуем строку JSON в массив
    return {
      ...list,
      list_of_ids: JSON.parse(list.list_of_ids)
    };
  } catch (error) {
    console.error('Ошибка при получении списка избранного:', error);
    throw error;
  }
}

/**
 * Создание нового списка избранного
 * @param {Object} listData - Данные списка
 * @param {string} listData.title - Название списка
 * @param {string} listData.description - Описание списка
 * @param {Array<number>} listData.list_of_ids - Массив ID избранных профессионалов
 * @param {number} listData.owner_user_id - ID владельца списка
 * @returns {Promise<Object>} - Созданный список
 */
export async function createParticipant(listData) {
  try {
    const { title, description, list_of_ids, owner_user_id } = listData;
    
    if (!title || !list_of_ids || !Array.isArray(list_of_ids)) {
      throw new Error('Некорректные данные для создания списка');
    }
    
    const db = await getDb();
    
    // Преобразуем массив ID в строку JSON
    const list_of_ids_json = JSON.stringify(list_of_ids);
    
    const result = await db.run(
      `INSERT INTO participants (title, description, list_of_ids, owner_user_id) 
       VALUES (?, ?, ?, ?)`,
      [title, description, list_of_ids_json, owner_user_id]
    );
    
    const newList = await db.get('SELECT * FROM participants WHERE id = ?', result.lastID);
    
    // Преобразуем строку JSON обратно в массив для ответа
    return {
      ...newList,
      list_of_ids: JSON.parse(newList.list_of_ids)
    };
  } catch (error) {
    console.error('Ошибка при создании списка избранного:', error);
    throw error;
  }
}

/**
 * Обновление существующего списка избранного
 * @param {number} listId - ID списка
 * @param {Object} listData - Обновленные данные списка
 * @returns {Promise<Object>} - Обновленный список
 */
export async function updateParticipant(listId, listData) {
  try {
    const { title, description, list_of_ids } = listData;
    
    const db = await getDb();
    
    // Получаем текущий список для проверки
    const existingList = await db.get('SELECT * FROM participants WHERE id = ?', listId);
    if (!existingList) {
      throw new Error('Список не найден');
    }
    
    // Формируем объект с обновленными данными
    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (list_of_ids !== undefined) {
      if (!Array.isArray(list_of_ids)) {
        throw new Error('list_of_ids должен быть массивом');
      }
      updatedData.list_of_ids = JSON.stringify(list_of_ids);
    }
    
    // Добавляем поле updated_at
    updatedData.updated_at = new Date().toISOString();
    
    // Формируем SQL запрос для обновления
    const fields = Object.keys(updatedData);
    if (fields.length === 0) {
      throw new Error('Нет данных для обновления');
    }
    
    const sql = `UPDATE participants SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE id = ?`;
    const values = [...Object.values(updatedData), listId];
    
    await db.run(sql, values);
    
    // Получаем обновленный список
    const updatedList = await db.get('SELECT * FROM participants WHERE id = ?', listId);
    
    // Преобразуем строку JSON обратно в массив для ответа
    return {
      ...updatedList,
      list_of_ids: JSON.parse(updatedList.list_of_ids)
    };
  } catch (error) {
    console.error('Ошибка при обновлении списка избранного:', error);
    throw error;
  }
}

/**
 * Удаление списка избранного
 * @param {number} listId - ID списка
 * @returns {Promise<boolean>} - Результат удаления
 */
export async function deleteParticipant(listId) {
  try {
    const db = await getDb();
    
    // Проверяем, существует ли список
    const existingList = await db.get('SELECT * FROM participants WHERE id = ?', listId);
    if (!existingList) {
      throw new Error('Список не найден');
    }
    
    await db.run('DELETE FROM participants WHERE id = ?', listId);
    return true;
  } catch (error) {
    console.error('Ошибка при удалении списка избранного:', error);
    throw error;
  }
}

/**
 * Добавление профессионала в список избранного
 * @param {number} listId - ID списка
 * @param {number} professionalId - ID профессионала
 * @returns {Promise<Object>} - Обновленный список
 */
export async function addProfessionalToList(listId, professionalId) {
  try {
    const db = await getDb();
    
    // Получаем текущий список
    const list = await db.get('SELECT * FROM participants WHERE id = ?', listId);
    if (!list) {
      throw new Error('Список не найден');
    }
    
    // Преобразуем строку JSON в массив
    const list_of_ids = JSON.parse(list.list_of_ids);
    
    // Проверяем, есть ли уже такой профессионал в списке
    if (!list_of_ids.includes(professionalId)) {
      list_of_ids.push(professionalId);
      
      // Обновляем список в базе данных
      await db.run(
        'UPDATE participants SET list_of_ids = ?, updated_at = datetime("now") WHERE id = ?',
        [JSON.stringify(list_of_ids), listId]
      );
    }
    
    // Получаем обновленный список
    const updatedList = await db.get('SELECT * FROM participants WHERE id = ?', listId);
    
    // Преобразуем строку JSON обратно в массив для ответа
    return {
      ...updatedList,
      list_of_ids: JSON.parse(updatedList.list_of_ids)
    };
  } catch (error) {
    console.error('Ошибка при добавлении профессионала в список:', error);
    throw error;
  }
}

/**
 * Удаление профессионала из списка избранного
 * @param {number} listId - ID списка
 * @param {number} professionalId - ID профессионала
 * @returns {Promise<Object>} - Обновленный список
 */
export async function removeProfessionalFromList(listId, professionalId) {
  try {
    const db = await getDb();
    
    // Получаем текущий список
    const list = await db.get('SELECT * FROM participants WHERE id = ?', listId);
    if (!list) {
      throw new Error('Список не найден');
    }
    
    // Преобразуем строку JSON в массив
    const list_of_ids = JSON.parse(list.list_of_ids);
    
    // Удаляем профессионала из списка
    const updatedIds = list_of_ids.filter(id => id !== professionalId);
    
    // Обновляем список в базе данных
    await db.run(
      'UPDATE participants SET list_of_ids = ?, updated_at = datetime("now") WHERE id = ?',
      [JSON.stringify(updatedIds), listId]
    );
    
    // Получаем обновленный список
    const updatedList = await db.get('SELECT * FROM participants WHERE id = ?', listId);
    
    // Преобразуем строку JSON обратно в массив для ответа
    return {
      ...updatedList,
      list_of_ids: JSON.parse(updatedList.list_of_ids)
    };
  } catch (error) {
    console.error('Ошибка при удалении профессионала из списка:', error);
    throw error;
  }
} 