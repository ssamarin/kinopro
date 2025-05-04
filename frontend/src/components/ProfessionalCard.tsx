import React from 'react';
import {
  Card,
  Box,
  Typography,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

interface Professional {
  id: number;
  name: string;
  profession: string;
  rating: number;
  experience: string;
  location: string;
  photo: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(2),
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
  borderRadius: 14,
  minHeight: 120,
  flex: 1,
  position: 'relative',
}));

const PhotoBox = styled(Box)(({ theme }) => ({
  width: 80,
  height: 100,
  borderRadius: 10,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  flexShrink: 0,
  marginRight: theme.spacing(2),
  border: `1.5px solid ${theme.palette.divider}`,
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
}));

const TopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  margin: `${theme.spacing(0.5)} 0`,
  flexWrap: 'wrap',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 14,
  minWidth: 100,
  minHeight: 32,
  padding: theme.spacing(0.5, 2),
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: 'none',
  marginLeft: 'auto',
  '&:hover': {
    background: theme.palette.primary.dark,
  },
}));

// Цвета для профессий
const professionColors: Record<string, string> = {
  'Актер': '#7C5DC9', // фиолетовый
  'Режиссер': '#3C5BC4', // синий
  'Продюсер': '#22C55E', // зеленый
  'Оператор': '#06B6D4', // бирюзовый
  'Гример': '#F472B6', // розовый
  'Монтажер': '#F59E42', // оранжевый
  'Сценарист': '#FFD600', // желтый
  'Кастинг-директор': '#EF4444', // красный
};

const ProfessionalCard: React.FC<{ professional: Professional }> = ({ professional }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/professionals/${professional.id}`);
  };

  return (
    <StyledCard>
      <PhotoBox style={{ backgroundImage: `url(${professional.photo})` }} />
      <ContentBox>
        <TopRow>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 17, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {professional.name}
          </Typography>
          <IconButton
            aria-label="add to favorites"
            onClick={() => toggleFavorite(professional.id)}
            sx={{
              color: isFavorite(professional.id) ? 'error.main' : 'grey.500',
              p: 0.5,
              outline: 'none',
              boxShadow: 'none',
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:focus-visible': { outline: 'none', boxShadow: 'none' },
            }}
          >
            {isFavorite(professional.id) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </TopRow>
        <Typography color="primary" sx={{ fontWeight: 500, fontSize: 15, mb: 0.5, mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Chip
            label={professional.profession}
            sx={{
              bgcolor: professionColors[professional.profession] || '#27272a',
              color: '#fff',
              fontWeight: 600,
              height: 28,
              fontSize: 15,
              pl: 0.5,
              boxShadow: `0 2px 8px 0 ${professionColors[professional.profession] || '#000'}22`,
              textTransform: 'capitalize',
              mb: 0.5,
              mt: 0.5,
              maxWidth: 120,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            size="small"
          />
        </Typography>
        <InfoRow>
          <Chip
            icon={<StarIcon sx={{ color: '#fbbf24', fontSize: 18 }} />}
            label={professional.rating}
            sx={{ bgcolor: '#27272a', color: '#fff', fontWeight: 600, height: 28, fontSize: 15, pl: 0.5 }}
            size="small"
          />
          <Chip
            icon={<WorkHistoryIcon sx={{ color: '#a1a1aa', fontSize: 18 }} />}
            label={professional.experience}
            sx={{ bgcolor: '#27272a', color: '#fff', height: 28, fontSize: 15, pl: 0.5 }}
            size="small"
          />
          <Chip
            icon={<LocationOnIcon sx={{ color: '#60a5fa', fontSize: 18 }} />}
            label={professional.location}
            sx={{ bgcolor: '#27272a', color: '#fff', height: 28, fontSize: 15, pl: 0.5 }}
            size="small"
          />
        </InfoRow>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <StyledButton 
            variant="contained" 
            onClick={handleDetailsClick}
            tabIndex={0}
            aria-label="Перейти на страницу профессионала"
          >
            Подробнее
          </StyledButton>
        </Box>
      </ContentBox>
    </StyledCard>
  );
};

export default ProfessionalCard; 