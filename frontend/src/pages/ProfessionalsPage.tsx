import React, { useState, useMemo } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import Header from '../components/Header';
import NowInCinemaSlider from '../components/NowInCinemaSlider';
import SearchAndFilters from '../components/SearchAndFilters';
import ProfessionalsList from '../components/ProfessionalsList';

const photoUrl = 'https://images2.novochag.ru/upload/img_cache/358/358a335d28cb3ebefa84f477c1c0e05e_cropped_666x781.jpg';

const names = [
  'Иван Петров', 'Анна Сидорова', 'Петр Иванов', 'Мария Смирнова', 'Алексей Кузнецов',
  'Екатерина Орлова', 'Дмитрий Волков', 'Ольга Павлова', 'Сергей Морозов', 'Наталья Федорова',
  'Владимир Соколов', 'Елена Васильева', 'Артем Попов', 'Татьяна Лебедева', 'Максим Новиков',
  'София Михайлова', 'Игорь Захаров', 'Алиса Белова', 'Роман Киселев', 'Вера Громова',
  'Георгий Котов', 'Дарья Крылова', 'Виктор Белов', 'Юлия Соловьева', 'Андрей Ефимов',
  'Ксения Климова', 'Глеб Соловьев', 'Полина Кузьмина', 'Виталий Гаврилов', 'Лидия Ковалева',
  'Валерий Денисов', 'Маргарита Сорокина', 'Евгений Куликов', 'Анастасия Баранова', 'Павел Гусев',
  'Людмила Киселева', 'Вячеслав Козлов', 'Ирина Кузнецова', 'Василий Орлов', 'Марина Сидорова',
  'Григорий Павлов', 'Елизавета Морозова', 'Аркадий Фролов', 'Олеся Соколова', 'Денис Кузьмин',
  'Светлана Громова', 'Антон Котов', 'Валентина Крылова', 'Михаил Белов', 'Евгения Соловьева',
];
const professions = ['Актер', 'Режиссер', 'Продюсер', 'Оператор', 'Гример', 'Сценарист', 'Монтажер', 'Кастинг-директор'];
const locations = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Сочи', 'Ростов-на-Дону', 'Воронеж'];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRating() {
  return +(Math.random() * 2 + 3).toFixed(1); // 3.0 - 5.0
}

function randomExperience() {
  const years = Math.floor(Math.random() * 20) + 1;
  if (years < 3) return `${years} год${years === 1 ? '' : 'а'}`;
  if (years < 5) return `${years} года`;
  return `${years} лет`;
}

export const mockProfessionals = [
  {
    id: 999,
    name: 'Тимур Бабенко',
    profession: 'Оператор',
    rating: 4.8,
    experience: '8 лет',
    location: 'Москва',
    photo: 'https://images2.novochag.ru/upload/img_cache/358/358a335d28cb3ebefa84f477c1c0e05e_cropped_666x781.jpg',
  },
  ...Array.from({ length: 120 }).map((_, i) => ({
    id: i + 1,
    name: randomFromArray(names),
    profession: randomFromArray(professions),
    rating: randomRating(),
    experience: randomExperience(),
    location: randomFromArray(locations),
    photo: photoUrl,
  }))
];

const ProfessionalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    profession: '',
    experience: '',
    location: '',
    ratingFrom: '',
    ratingTo: '',
    onlyWithPhoto: false,
    onlyWithReviews: false,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  const filteredProfessionals = useMemo(() => {
    return mockProfessionals.filter((pro) => {
      // Поиск по имени или профессии
      const search = searchQuery.trim().toLowerCase();
      if (search && !(
        pro.name.toLowerCase().includes(search) ||
        pro.profession.toLowerCase().includes(search)
      )) return false;
      // Фильтр по профессии
      if (filters.profession && pro.profession !== filters.profession) return false;
      // Фильтр по городу
      if (filters.location && pro.location !== filters.location) return false;
      // Фильтр по рейтингу
      if (filters.ratingFrom && pro.rating < Number(filters.ratingFrom)) return false;
      if (filters.ratingTo && pro.rating > Number(filters.ratingTo)) return false;
      // Фильтр по фото (в демо всегда true)
      if (filters.onlyWithPhoto && !pro.photo) return false;
      // Фильтр по отзывам (в демо всегда true)
      if (filters.onlyWithReviews) return false; // нет отзывов в демо
      return true;
    });
  }, [searchQuery, filters]);

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
        <ProfessionalsList allProfessionals={filteredProfessionals} />
      </Container>
    </Box>
  );
};

export default ProfessionalsPage; 