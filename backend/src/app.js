import express from 'express';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import userRoutes from './routes/users.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';

dotenv.config();

const app = express();

// Настройка CORS для лучшей совместимости
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Адреса фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Расширенное логирование для отладки запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers));
  if (req.method !== 'GET') {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

app.use(express.json());
app.use('/api/auth', authRoutes);

// Добавляем маршруты для работы с резюме, городами и профессиями
app.use('/api', resumeRoutes);

// Добавляем маршруты для работы с профилем пользователя
app.use('/api/users', userRoutes);

// Проверка работы API
app.get('/', (req, res) => {
  res.json({ message: 'API работает!' });
});

// Добавим маршрут для проверки соединения
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// Инициализация базы данных и запуск сервера
initDb().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Backend started on http://localhost:${PORT}`);
    console.log(`CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
  });
}).catch(err => {
  console.error('Ошибка при инициализации базы данных:', err);
});