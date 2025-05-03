import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Fade, Stack } from '@mui/material';
import { SxProps } from '@mui/system';

const slides = [
  {
    title: 'Безумный Макс: Дорога ярости',
    genre: 'Боевик, Приключения',
    description: 'Погоня, пустыня, выживание и зрелищные спецэффекты. Новая глава культовой франшизы на большом экране!',
    poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/2b1e2e7b-7e2e-4e2e-8e2e-2e2e2e2e2e2e/600x900',
  },
  {
    title: 'Вызов',
    genre: 'Драма, Фантастика',
    description: 'Первая в мире художественная картина, частично снятая на МКС. Российский космос, драма и подвиг.',
    poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d/600x900',
  },
  {
    title: 'Гарри Поттер и философский камень',
    genre: 'Фэнтези, Приключения',
    description: 'Классика для всей семьи. Погрузитесь в магию Хогвартса на большом экране!',
    poster: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/1a2b3c4d5e6f7a8b9c0d/600x900',
  },
];

const SLIDE_INTERVAL = 6000;

type NowInCinemaSliderProps = { sx?: SxProps };

const NowInCinemaSlider: React.FC<NowInCinemaSliderProps> = ({ sx }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', position: 'relative', ...sx }}>
      <Box sx={{ position: 'relative', height: { xs: 340, sm: 400, md: 420 }, borderRadius: 5, overflow: 'hidden', bgcolor: '#222' }}>
        {slides.map((slide, idx) => (
          <Fade in={active === idx} timeout={600} key={slide.title} unmountOnExit>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="stretch" sx={{ position: 'absolute', width: '100%', height: '100%' }}>
              <Box
                sx={{
                  width: { xs: '100%', md: 320 },
                  height: { xs: 220, md: '100%' },
                  background: `url(${slide.poster}) center/cover no-repeat`,
                  borderRadius: { xs: '0 0 32px 32px', md: '32px 0 0 32px' },
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>{slide.title}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'secondary.main', fontWeight: 500, mb: 2 }}>{slide.genre}</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 20, mb: 3 }}>{slide.description}</Typography>
                <Button variant="contained" color="primary" size="large" sx={{ width: 180, fontSize: 18, borderRadius: 3 }}>
                  Подробнее
                </Button>
              </Box>
            </Stack>
          </Fade>
        ))}
      </Box>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        {slides.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setActive(idx)}
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              bgcolor: active === idx ? 'primary.main' : 'grey.700',
              boxShadow: active === idx ? '0 0 0 4px #5B3CC455' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default NowInCinemaSlider; 