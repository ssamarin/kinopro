import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email уже занят' });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(email, hash);
    res.json({ id: user.id, email: user.email });
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

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка входа', details: error.message });
  }
});

export default router;