import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import Header from '../components/Header';
import NowInCinemaSlider from '../components/NowInCinemaSlider';
import SearchAndFilters from '../components/SearchAndFilters';
import ProfessionalsList from '../components/ProfessionalsList';
import { Professional } from '../components/ProfessionalCard';

const ProfessionalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    professionGroup: '',
    profession: '',
    experience: '',
    location: '',
    ratingFrom: '',
    ratingTo: '',
    onlyWithPhoto: false,
    onlyWithReviews: false,
  });
  
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  // Разбиваем логику фильтрации на отдельные функции
  const filterBySearchQuery = (pro: Professional, search: string) => {
    if (!search) return true;
    
    return pro.name.toLowerCase().includes(search) || 
           pro.profession.toLowerCase().includes(search);
  };
  
  const filterByProfessionGroup = (pro: Professional, groupId: string) => {
    if (!groupId) return true;
    
    return Number(pro.professionGroupId) === Number(groupId);
  };
  
  const filterByProfession = (pro: Professional, professionId: string) => {
    if (!professionId) return true;
    
    return Number(pro.professionId) === Number(professionId);
  };
  
  const filterByLocation = (pro: Professional, cityId: string) => {
    if (!cityId) return true;
    
    return Number(pro.cityId) === Number(cityId);
  };
  
  const filterByExperience = (pro: Professional, minExperience: string) => {
    if (!minExperience) return true;
    
    const minExp = parseInt(minExperience);
    const proExp = parseInt(pro.experience.split(' ')[0]);
    
    return proExp >= minExp;
  };
  
  const filterByRating = (pro: Professional, minRating: string, maxRating: string) => {
    // Фильтр по минимальному рейтингу
    if (minRating) {
      const minValue = Number(minRating);
      // Если минимальный рейтинг > 0, исключаем карточки с null или 0 рейтингом
      if (minValue > 0 && (pro.rating === null || pro.rating === 0)) {
        return false;
      }
      // Проверяем нижнюю границу рейтинга (только для не-null значений)
      if (pro.rating !== null && pro.rating < minValue) {
        return false;
      }
    }
    
    // Проверяем верхнюю границу рейтинга
    if (maxRating && pro.rating !== null && pro.rating > Number(maxRating)) {
      return false;
    }
    
    return true;
  };
  
  const filterByPhoto = (pro: Professional, onlyWithPhoto: boolean) => {
    if (!onlyWithPhoto) return true;
    
    return !!pro.photo;
  };
  
  const filterByFeedback = (pro: Professional, onlyWithReviews: boolean) => {
    if (!onlyWithReviews) return true;
    
    return pro.hasFeedback;
  };

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((pro) => {
      const search = searchQuery.trim().toLowerCase();
      
      // Применяем все фильтры поочередно
      if (!filterBySearchQuery(pro, search)) return false;
      if (!filterByProfessionGroup(pro, filters.professionGroup)) return false;
      if (!filterByProfession(pro, filters.profession)) return false;
      if (!filterByLocation(pro, filters.location)) return false;
      if (!filterByExperience(pro, filters.experience)) return false;
      if (!filterByRating(pro, filters.ratingFrom, filters.ratingTo)) return false;
      if (!filterByPhoto(pro, filters.onlyWithPhoto)) return false;
      if (!filterByFeedback(pro, filters.onlyWithReviews)) return false;
      
      return true;
    });
  }, [searchQuery, filters, professionals]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <NowInCinemaSlider sx={{ mt: 2, mb: 2 }} />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: 'primary.main',
            textAlign: 'center',
          }}
        >
          Найди своего специалиста
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Paper>
        
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
            {filteredProfessionals.length === 0 ? (
              <Alert severity="info">
                По вашему запросу не найдено ни одного специалиста
              </Alert>
            ) : (
              <ProfessionalsList allProfessionals={filteredProfessionals} />
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProfessionalsPage; 