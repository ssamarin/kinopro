import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName = '', lastName = '' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email уже занят' });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(email, hash, firstName, lastName);
    
    // Создаем токен для автоматического входа после регистрации
    const JWT_SECRET = process.env.JWT_SECRET || 'kinopro_super_secret_token_key_2024';
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token,
      id: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Ошибка регистрации', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const user = await findUserByEmail(email);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(401).json({ error: 'Неверные данные' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', valid);

    if (!valid) {
      return res.status(401).json({ error: 'Неверные данные' });
    }

    // Используем жестко заданный ключ, если переменная окружения не задана
    const JWT_SECRET = process.env.JWT_SECRET || 'kinopro_super_secret_token_key_2024';

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Возвращаем токен и данные пользователя
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка входа', details: error.message });
  }
});

export default router;