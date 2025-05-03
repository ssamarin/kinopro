import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import { mockProfessionals } from './ProfessionalsPage';
import { useFavorites } from '../context/FavoritesContext';

// Определим интерфейс для профессионала
interface ProfessionalDetail {
  id: number;
  name: string;
  profession: string;
  rating: number;
  experience: string;
  location: string;
  photo: string;
  bio: string;
}

const StyledImage = styled('div')(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: 16,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `2px solid ${theme.palette.divider}`,
}));

const WorkSample = styled('div')(({ theme }) => ({
  minWidth: 200,
  height: 300,
  borderRadius: 8,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0,
  backgroundColor: theme.palette.grey[800],
}));

const VideoSample = styled('div')(({ theme }) => ({
  minWidth: 300,
  height: 200,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  flexShrink: 0,
  backgroundColor: theme.palette.grey[800],
}));

const ProfessionalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [professional, setProfessional] = useState<ProfessionalDetail | null>(null);

  useEffect(() => {
    if (id) {
      // Если id === 'timur-babenko', находим специально созданный профиль
      if (id === 'timur-babenko') {
        setProfessional({
          id: 999,
          name: 'Тимур Бабенко',
          profession: 'Оператор',
          rating: 4.8,
          experience: '8 лет',
          location: 'Москва',
          photo: 'https://images2.novochag.ru/upload/img_cache/358/358a335d28cb3ebefa84f477c1c0e05e_cropped_666x781.jpg',
          bio: 'Профессиональный оператор с опытом работы более 8 лет. Специализируюсь на съемках художественных фильмов и рекламных роликов. Работал на проектах для крупных брендов.'
        });
      } else {
        // Иначе ищем в основном списке по id
        const found = mockProfessionals.find(p => p.id === Number(id));
        if (found) {
          setProfessional({
            ...found,
            bio: 'Профессиональный специалист с большим опытом работы в киноиндустрии. Принимал участие в создании известных проектов.'
          });
        }
      }
    }
  }, [id]);

  if (!professional) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5">Профессионал не найден</Typography>
        <Button onClick={() => navigate('/')} startIcon={<ArrowBackIcon />}>
          Вернуться к списку
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Верхняя панель */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', position: 'relative' }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ position: 'absolute', left: 16 }}
          aria-label="Назад"
          tabIndex={0}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
          Профиль
        </Typography>
      </Box>
      
      {/* Информация о профессионале */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {professional.name}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {professional.profession}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {professional.location}
          </Typography>
        </Box>
        <StyledImage sx={{ backgroundImage: `url(${professional.photo})` }} />
      </Box>
      
      {/* Биография */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Биография
        </Typography>
        <Typography color="text.secondary">
          {professional.bio}
        </Typography>
      </Box>
      
      {/* Примеры работ */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Примеры работ
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
            <WorkSample sx={{ backgroundImage: `url(${professional.photo})` }} />
            <VideoSample>
              <Typography>Видео</Typography>
            </VideoSample>
            <WorkSample sx={{ backgroundImage: `url(${professional.photo})` }} />
            <WorkSample sx={{ backgroundImage: `url(${professional.photo})` }} />
            <VideoSample>
              <Typography>Видео</Typography>
            </VideoSample>
          </Box>
        </Box>
      </Box>
      
      {/* Рейтинг и отзывы */}
      <Box sx={{ px: 3, py: 2, mx: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Рейтинг
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ color: 'yellow', fontSize: 18 }} />
            <Typography sx={{ ml: 0.5 }}>{professional.rating}</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          На основе 24 отзывов
        </Typography>
      </Box>
      
      {/* Кнопки действий */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        bgcolor: 'background.default', 
        borderTop: 1, 
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<MessageIcon />}
            tabIndex={0}
            aria-label="Написать сообщение"
          >
            Написать
          </Button>
          <IconButton 
            onClick={() => toggleFavorite(professional.id)}
            sx={{ 
              p: 1.5, 
              bgcolor: isFavorite(professional.id) ? 'error.main' : 'action.hover',
              color: isFavorite(professional.id) ? 'white' : 'action.active',
              borderRadius: 1
            }}
            tabIndex={0}
            aria-label={isFavorite(professional.id) ? "Удалить из избранного" : "Добавить в избранное"}
          >
            {isFavorite(professional.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfessionalDetailPage; 