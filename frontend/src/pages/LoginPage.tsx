import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, InputAdornment, IconButton, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        login(data.token, { email });
        setMsg('Успешный вход!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        const data = await res.json();
        setMsg(data.error || 'Ошибка входа');
      }
    } catch (e) {
      setMsg('Ошибка сети');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, maxWidth: 400, width: '100%', borderRadius: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LockOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Вход</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Войдите в свой аккаунт</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              required
            />
            <TextField
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ fontWeight: 700, fontSize: 18, borderRadius: 3, mt: 1 }} fullWidth>
              Войти
            </Button>
          </Stack>
        </form>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Нет аккаунта?{' '}
            <Link href="#" underline="hover" onClick={() => navigate('/register')} sx={{ color: 'primary.main', fontWeight: 600 }}>
              Зарегистрироваться
            </Link>
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="text"
            sx={{ mt: 2, color: 'primary.main', fontWeight: 600 }}
            fullWidth
          >
            Вернуться на главную
          </Button>
          <Typography sx={{ mt: 2, color: msg === 'Успешный вход!' ? 'green' : 'red' }}>{msg}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage; 