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
  const [filtersEnabled, setFiltersEnabled] = useState(true);
  
  // Загрузка специалистов из БД
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Получаем токен из localStorage, если есть
        const token = localStorage.getItem('token');
        
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/professionals', {
          headers
        });
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить список специалистов');
        }
        
        const data = await response.json();
        
        // Новый формат ответа API
        if (data && typeof data === 'object' && 'professionals' in data) {
          setProfessionals(data.professionals || []);
          setFiltersEnabled(data.filtersEnabled || false);
        } else {
          // Обрабатываем старый формат для совместимости
          setProfessionals(Array.isArray(data) ? data : []);
          setFiltersEnabled(true);
        }
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

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((pro) => {
      // Поиск по имени или профессии
      const search = searchQuery.trim().toLowerCase();
      if (search && !(
        pro.name.toLowerCase().includes(search) ||
        pro.profession.toLowerCase().includes(search)
      )) return false;
      
      // Фильтр по группе профессий
      if (filters.professionGroup && Number(pro.professionGroupId) !== Number(filters.professionGroup)) return false;
      
      // Фильтр по профессии
      if (filters.profession && Number(pro.professionId) !== Number(filters.profession)) return false;
      
      // Фильтр по городу
      if (filters.location && Number(pro.cityId) !== Number(filters.location)) return false;
      
      // Фильтр по опыту (преобразуем строку вида "X лет/года" в число)
      if (filters.experience) {
        const minExperience = parseInt(filters.experience as string);
        const proExperience = parseInt(pro.experience.split(' ')[0]);
        if (proExperience < minExperience) return false;
      }
      
      // Фильтр по рейтингу
      if (filters.ratingFrom) {
        const minRating = Number(filters.ratingFrom);
        // Если минимальный рейтинг > 0, исключаем карточки с null или 0 рейтингом
        if (minRating > 0 && (pro.rating === null || pro.rating === 0)) {
          return false;
        }
        // Проверяем нижнюю границу рейтинга (только для не-null значений)
        if (pro.rating !== null && pro.rating < minRating) {
          return false;
        }
      }
      
      // Проверяем верхнюю границу рейтинга
      if (filters.ratingTo && pro.rating !== null && pro.rating > Number(filters.ratingTo)) {
        return false;
      }
      
      // Фильтр по фото
      if (filters.onlyWithPhoto && !pro.photo) return false;
      
      // Фильтр по отзывам
      if (filters.onlyWithReviews && !pro.hasFeedback) return false;
      
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
          {!filtersEnabled && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Для доступа к фильтрам и просмотра всех профессионалов необходимо заполнить свой профиль
            </Alert>
          )}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
            disabled={!filtersEnabled}
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