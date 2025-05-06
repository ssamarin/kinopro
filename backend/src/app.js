import express from 'express';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';

dotenv.config();

const app = express();

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Проверка работы API
app.get('/', (req, res) => {
  res.json({ message: 'API работает!' });
});

// Инициализация базы данных и запуск сервера
initDb().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Backend started on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Ошибка при инициализации базы данных:', err);
});