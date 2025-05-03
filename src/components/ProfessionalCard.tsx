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

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <StyledCard>
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
  );
};

export default ProfessionalCard; 