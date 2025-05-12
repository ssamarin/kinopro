import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Alert, Button, IconButton } from '@mui/material';
import Header from '../components/Header';
import ProfessionalsList from '../components/ProfessionalsList';
import { useFavorites } from '../context/FavoritesContext';
import { Professional } from '../components/ProfessionalCard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Загрузка специалистов из БД
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/professionals');
        if (!response.ok) {
          throw new Error('Не удалось загрузить список специалистов');
        }
        
        const data = await response.json();
        setProfessionals(data);
      } catch (err) {
        console.error('Ошибка при загрузке специалистов:', err);
        setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionals();
  }, []);
  
  // Фильтруем только избранных специалистов
  const favoriteProfessionals = professionals.filter((pro) => favorites.includes(pro.id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate('/')} 
              sx={{ mr: 1 }}
              aria-label="На главную"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              Избранные специалисты
            </Typography>
          </Box>
          
          {isAuthenticated && (
            <Button
              component={RouterLink}
              to="/favorite-lists"
              variant="outlined"
              startIcon={<ListAltIcon />}
              sx={{
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                padding: '8px 16px',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(91,60,196,0.25)',
                }
              }}
            >
              Мои списки
            </Button>
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {favoriteProfessionals.length === 0 ? (
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center', mt: 8 }}>
                У вас пока нет избранных специалистов.
              </Typography>
            ) : (
              <ProfessionalsList allProfessionals={favoriteProfessionals} />
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage; 