import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const CardContentWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
});

const mockProfessionals: Professional[] = [
  {
    id: 1,
    name: 'Анна Иванова',
    profession: 'Гример',
    rating: 4.8,
    experience: '5 лет',
    location: 'Москва',
    photo: 'https://source.unsplash.com/random/200x200?makeup',
  },
  {
    id: 2,
    name: 'Петр Пидоров',
    profession: 'Оператор',
    rating: 4.9,
    experience: '8 лет',
    location: 'Санкт-Петербург',
    photo: 'https://source.unsplash.com/random/200x200?camera',
  },
  {
    id: 3,
    name: 'Мария Петрова',
    profession: 'Режиссер',
    rating: 4.7,
    experience: '10 лет',
    location: 'Москва',
    photo: 'https://source.unsplash.com/random/200x200?director',
  },
];

const ProfessionalsList: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      {mockProfessionals.map((professional) => (
        <StyledCard key={professional.id}>
          <CardMedia
            component="img"
            sx={{ width: 200, height: 200 }}
            image={professional.photo}
            alt={professional.name}
          />
          <CardContentWrapper>
            <CardContent>
              <Typography variant="h5" component="div">
                {professional.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {professional.profession}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={professional.rating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {professional.rating}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Опыт: {professional.experience}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Локация: {professional.location}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="contained" color="primary" fullWidth>
                Подробнее
              </Button>
            </Box>
          </CardContentWrapper>
        </StyledCard>
      ))}
    </Box>
  );
};

export default ProfessionalsList; 