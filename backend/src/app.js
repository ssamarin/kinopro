import express from 'express';
import authRoutes from './routes/auth.js';
import cors from 'cors';

const app = express();

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(4000, () => {
  console.log('Backend started on http://localhost:4000');
});