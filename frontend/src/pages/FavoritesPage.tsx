import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Header from '../components/Header';
import ProfessionalsList from '../components/ProfessionalsList';
import { useFavorites } from '../context/FavoritesContext';
import { mockProfessionals } from './ProfessionalsPage';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const favoriteProfessionals = mockProfessionals.filter((pro) => favorites.includes(pro.id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}
        >
          Избранные специалисты
        </Typography>
        {favoriteProfessionals.length === 0 ? (
          <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center', mt: 8 }}>
            У вас пока нет избранных специалистов.
          </Typography>
        ) : (
          <ProfessionalsList allProfessionals={favoriteProfessionals} />
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage; 