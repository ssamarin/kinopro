import { getDb } from '../db.js';

export async function findUserByEmail(email) {
  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return user;
  } catch (error) {
    console.error('Ошибка при поиске пользователя:', error);
    throw error;
  }
}

export async function createUser(email, passwordHash, firstName = '', lastName = '') {
  try {
    const db = await getDb();
    
    // Если имя и фамилия не предоставлены, извлекаем из email
    if (!firstName && !lastName) {
      const nameParts = email.split('@')[0].split('.');
      if (nameParts.length > 1) {
        firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
        lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
      } else {
        firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      }
    }
    
    const result = await db.run(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, passwordHash, firstName, lastName]
    );
    return { id: result.lastID, email, firstName, lastName };
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}

export async function updateUserNames(userId, firstName, lastName) {
  try {
    const db = await getDb();
    
    // Получаем текущие данные пользователя перед обновлением
    const user = await db.get('SELECT * FROM users WHERE id = ?', userId);
    if (!user) {
      throw new Error(`Пользователь с ID ${userId} не найден`);
    }
    
    // Используем существующие значения, если новые не предоставлены
    const updatedFirstName = firstName !== undefined ? firstName : user.first_name;
    const updatedLastName = lastName !== undefined ? lastName : user.last_name;
    
    const result = await db.run(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [updatedFirstName, updatedLastName, userId]
    );
    
    if (result.changes === 0) {
      throw new Error(`Не удалось обновить пользователя с ID ${userId}`);
    }
    
    // Получаем обновленные данные пользователя
    const updatedUser = await db.get('SELECT id, email, first_name, last_name FROM users WHERE id = ?', userId);
    
    return { 
      id: updatedUser.id, 
      email: updatedUser.email,
      firstName: updatedUser.first_name, 
      lastName: updatedUser.last_name 
    };
  } catch (error) {
    console.error('Ошибка при обновлении имени пользователя:', error);
    throw error;
  }
}