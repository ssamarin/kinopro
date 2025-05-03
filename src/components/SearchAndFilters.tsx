import React from 'react';
import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from '@mui/material';

interface SearchAndFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filter: string, value: string) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ onSearch, onFilterChange }) => {
  const handleFilterChange = (event: SelectChangeEvent<string>, filter: string) => {
    onFilterChange(filter, event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <TextField
        fullWidth
        placeholder="Введите имя или профессию"
        variant="outlined"
        onChange={(e) => onSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Профессия</InputLabel>
            <Select<string>
              label="Профессия"
              onChange={(e) => handleFilterChange(e, 'profession')}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="makeup">Гример</MenuItem>
              <MenuItem value="operator">Оператор</MenuItem>
              <MenuItem value="director">Режиссер</MenuItem>
              <MenuItem value="editor">Монтажер</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Опыт</InputLabel>
            <Select<string>
              label="Опыт"
              onChange={(e) => handleFilterChange(e, 'experience')}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="1-3">1-3 года</MenuItem>
              <MenuItem value="3-5">3-5 лет</MenuItem>
              <MenuItem value="5+">5+ лет</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Рейтинг</InputLabel>
            <Select<string>
              label="Рейтинг"
              onChange={(e) => handleFilterChange(e, 'rating')}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="4+">4+</MenuItem>
              <MenuItem value="4.5+">4.5+</MenuItem>
              <MenuItem value="5">5</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Локация</InputLabel>
            <Select<string>
              label="Локация"
              onChange={(e) => handleFilterChange(e, 'location')}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="moscow">Москва</MenuItem>
              <MenuItem value="spb">Санкт-Петербург</MenuItem>
              <MenuItem value="other">Другие города</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchAndFilters; 