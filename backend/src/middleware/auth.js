import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }
  
  try {
    // Используем жестко заданный ключ, если переменная окружения не задана
    const JWT_SECRET = process.env.JWT_SECRET || 'kinopro_super_secret_token_key_2024';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Токен истек' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Недействительный токен' });
    }
    console.error('Ошибка при проверке токена:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}; 