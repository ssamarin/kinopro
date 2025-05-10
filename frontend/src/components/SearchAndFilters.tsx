import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Slider,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';

interface Option {
  label: string;
}

interface City {
  id: number;
  city: string;
}

interface ProfessionGroup {
  id: number;
  name: string;
}

interface Profession {
  id: number;
  group_id: number;
  name: string;
}

const professions: Option[] = [
  { label: 'Актер' },
  { label: 'Режиссер' },
  { label: 'Продюсер' },
  { label: 'Оператор' },
  { label: 'Гример' },
];

const locations: Option[] = [
  { label: 'Москва' },
  { label: 'Санкт-Петербург' },
  { label: 'Казань' },
  { label: 'Новосибирск' },
  { label: 'Другие' },
];

// Цвета для фильтров
const professionColor = '#5B3CC4'; // индиго
const cityColor = '#3C5BC4'; // синий
const ratingColor = '#FFB300'; // янтарный
const checkboxColor = '#22C55E'; // зеленый
const ratingAccent = '#7C5DC9'; // фиолетовый акцент
const checkboxAccent = '#7C5DC9';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 20,
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)',
  padding: theme.spacing(3, 3, 3, 3),
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 18,
  marginTop: theme.spacing(2),
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  minHeight: 56,
  '&:hover': {
    background: theme.palette.primary.dark,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    fontSize: 18,
    minHeight: 56,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& input': {
      fontSize: 18,
      padding: theme.spacing(2, 1),
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: 16,
    color: theme.palette.text.secondary,
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 12,
  borderRadius: 6,
  padding: '24px 0',
  '& .MuiSlider-thumb': {
    backgroundColor: '#fff',
    border: `3px solid ${theme.palette.primary.main}`,
    width: 32,
    height: 32,
    boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
    transition: 'box-shadow 0.2s',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(37,99,235,0.15)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.4,
    backgroundColor: theme.palette.grey[800],
    height: 12,
    borderRadius: 6,
  },
  '& .MuiSlider-track': {
    backgroundColor: theme.palette.primary.main,
    height: 12,
    borderRadius: 6,
  },
  '& .MuiSlider-markLabel': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: 16,
    top: 38,
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-root': {
    borderRadius: 16,
    fontSize: 18,
    minHeight: 56,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
      borderRadius: 16,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '& input': {
      fontSize: 18,
      padding: theme.spacing(2, 1),
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: 16,
    color: theme.palette.text.secondary,
  },
  '& .MuiAutocomplete-endAdornment': {
    right: 16,
  },
  '& .MuiAutocomplete-listbox': {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 16,
    marginTop: 8,
    minWidth: 260,
    maxWidth: 400,
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
    padding: 0,
    transition: 'box-shadow 0.2s',
    '& .MuiAutocomplete-option': {
      padding: '16px 24px',
      fontSize: 18,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRadius: 12,
      margin: '4px 8px',
      transition: 'background 0.15s',
      '&:hover': {
        backgroundColor: 'rgba(37, 99, 235, 0.10)',
      },
      '&[aria-selected="true"]': {
        backgroundColor: 'rgba(37, 99, 235, 0.16)',
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },
  },
  '& .MuiAutocomplete-paper': {
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
    borderRadius: 16,
    marginTop: 8,
  },
}));

// StyledAutocomplete для профессии
const ProfessionAutocomplete = styled(StyledAutocomplete)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderColor: professionColor,
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: professionColor,
    },
  },
  '& .MuiAutocomplete-listbox': {
    '& .MuiAutocomplete-option': {
      '&[aria-selected="true"]': {
        backgroundColor: professionColor + '22',
        color: professionColor,
      },
    },
  },
}));

// StyledAutocomplete для города
const CityAutocomplete = styled(StyledAutocomplete)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderColor: cityColor,
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: cityColor,
    },
  },
  '& .MuiAutocomplete-listbox': {
    '& .MuiAutocomplete-option': {
      '&[aria-selected="true"]': {
        backgroundColor: cityColor + '22',
        color: cityColor,
      },
    },
  },
}));

// StyledSlider для рейтинга
const ColoredSlider = styled(StyledSlider)(({ theme }) => ({
  color: ratingAccent,
  height: 6,
  borderRadius: 3,
  padding: '28px 0 18px 0',
  '& .MuiSlider-thumb': {
    backgroundColor: '#fff',
    border: `3px solid ${ratingAccent}`,
    width: 28,
    height: 28,
    boxShadow: `0 0 0 6px ${ratingAccent}22`,
    transition: 'box-shadow 0.2s',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0 0 0 10px ${ratingAccent}33`,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.25,
    backgroundColor: ratingAccent,
    height: 6,
    borderRadius: 3,
  },
  '& .MuiSlider-track': {
    backgroundColor: ratingAccent,
    height: 6,
    borderRadius: 3,
  },
  '& .MuiSlider-markLabel': {
    display: 'none',
  },
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: checkboxAccent,
  '&.Mui-checked': {
    color: checkboxAccent,
    boxShadow: `0 0 0 4px ${checkboxAccent}22`,
    transition: 'box-shadow 0.2s',
  },
  '&:hover': {
    boxShadow: `0 0 0 6px ${checkboxAccent}33`,
    backgroundColor: 'transparent',
  },
  borderRadius: 6,
  width: 28,
  height: 28,
  transition: 'box-shadow 0.2s',
}));

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    professionGroup: string | number;
    profession: string | number;
    experience: string;
    location: string | number;
    ratingFrom: string;
    ratingTo: string;
    onlyWithPhoto: boolean;
    onlyWithReviews: boolean;
  };
  onFilterChange: (filter: string, value: any) => void;
  disabled?: boolean;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  disabled = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [professionGroups, setProfessionGroups] = useState<ProfessionGroup[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [filteredProfessions, setFilteredProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка данных из БД
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Загружаем города
        const citiesResponse = await fetch('/api/cities');
        if (!citiesResponse.ok) throw new Error('Не удалось загрузить список городов');
        const citiesData = await citiesResponse.json();
        setCities(citiesData);
        
        // Загружаем группы профессий
        const groupsResponse = await fetch('/api/profession-groups');
        if (!groupsResponse.ok) throw new Error('Не удалось загрузить группы профессий');
        const groupsData = await groupsResponse.json();
        setProfessionGroups(groupsData);
        
        // Загружаем профессии
        const professionsResponse = await fetch('/api/professions');
        if (!professionsResponse.ok) throw new Error('Не удалось загрузить профессии');
        const professionsData = await professionsResponse.json();
        setProfessions(professionsData);
      } catch (err) {
        console.error('Ошибка при загрузке данных для фильтров:', err);
        setError('Не удалось загрузить данные для фильтров');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Фильтрация профессий при изменении группы
  useEffect(() => {
    if (filters.professionGroup) {
      const filtered = professions.filter(p => Number(p.group_id) === Number(filters.professionGroup));
      setFilteredProfessions(filtered);
      
      // Сбросить выбранную профессию, если она не из текущей группы
      const professionExists = filtered.some(p => Number(p.id) === Number(filters.profession));
      if (!professionExists) {
        onFilterChange('profession', '');
      }
    } else {
      setFilteredProfessions([]);
      onFilterChange('profession', '');
    }
  }, [filters.professionGroup, professions]);

  const toggleFilters = () => {
    if (!disabled) {
      setShowFilters(!showFilters);
    }
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onFilterChange('ratingFrom', newValue[0].toString());
      onFilterChange('ratingTo', newValue[1].toString());
    }
  };

  const ratingValue = [
    Number(filters.ratingFrom || 0),
    Number(filters.ratingTo || 5),
  ];

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Поиск специалиста по имени или профессии"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Button
          startIcon={<FilterListIcon />}
          endIcon={showFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          onClick={toggleFilters}
          sx={{
            textTransform: 'none',
            color: disabled ? 'text.disabled' : 'text.secondary',
            '&:hover': { 
              bgcolor: 'transparent', 
              color: disabled ? 'text.disabled' : 'primary.main' 
            },
          }}
          disabled={disabled}
        >
          Фильтры {disabled && '(недоступны)'}
        </Button>
      </Box>

      <Collapse in={showFilters && !disabled}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          mt: 2,
          alignItems: 'flex-start'
        }}>
          <Box sx={{ minWidth: '180px', flexGrow: 1, maxWidth: '250px' }}>
            <FormControl size="small" sx={{ width: '100%' }} disabled={disabled}>
              <InputLabel>Группа профессий</InputLabel>
              <Select
                value={filters.professionGroup}
                onChange={(e) => onFilterChange('professionGroup', e.target.value)}
                label="Группа профессий"
                sx={{
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                <MenuItem value="">Все группы</MenuItem>
                {professionGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ minWidth: '180px', flexGrow: 1, maxWidth: '250px' }}>
            <FormControl size="small" disabled={!filters.professionGroup || disabled} sx={{ width: '100%' }}>
              <InputLabel>Профессия</InputLabel>
              <Select
                value={filters.profession}
                onChange={(e) => onFilterChange('profession', e.target.value)}
                label="Профессия"
                sx={{
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                <MenuItem value="">Все профессии</MenuItem>
                {filteredProfessions.map((profession) => (
                  <MenuItem key={profession.id} value={profession.id}>
                    {profession.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: '150px', flexGrow: 1, maxWidth: '220px' }}>
            <FormControl size="small" sx={{ width: '100%' }} disabled={disabled}>
              <InputLabel>Город</InputLabel>
              <Select
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                label="Город"
                sx={{
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                <MenuItem value="">Все города</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: '150px', flexGrow: 1, maxWidth: '200px' }}>
            <FormControl size="small" sx={{ width: '100%' }} disabled={disabled}>
              <InputLabel>Опыт работы</InputLabel>
              <Select
                value={filters.experience}
                onChange={(e) => onFilterChange('experience', e.target.value)}
                label="Опыт работы"
                sx={{
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                <MenuItem value="">Любой опыт</MenuItem>
                <MenuItem value="1">От 1 года</MenuItem>
                <MenuItem value="3">От 3 лет</MenuItem>
                <MenuItem value="5">От 5 лет</MenuItem>
                <MenuItem value="10">От 10 лет</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ width: '100%', mt: 1, mb: 1, px: 1 }}>
            <Typography gutterBottom fontWeight="medium">Рейтинг</Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={ratingValue}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5, label: '5' },
                ]}
                sx={{
                  '& .MuiSlider-thumb': {
                    height: 20,
                    width: 20,
                  },
                  '& .MuiSlider-track': {
                    height: 8,
                  },
                  '& .MuiSlider-rail': {
                    height: 8,
                  }
                }}
                disabled={disabled}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyWithPhoto}
                  onChange={(e) => onFilterChange('onlyWithPhoto', e.target.checked)}
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    }
                  }}
                  disabled={disabled}
                />
              }
              label="Только с фото"
              sx={{ 
                fontWeight: filters.onlyWithPhoto ? 'medium' : 'normal',
                userSelect: 'none'
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyWithReviews}
                  onChange={(e) => onFilterChange('onlyWithReviews', e.target.checked)}
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    }
                  }}
                  disabled={disabled}
                />
              }
              label="Только с отзывами"
              sx={{ 
                fontWeight: filters.onlyWithReviews ? 'medium' : 'normal',
                userSelect: 'none'
              }}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default SearchAndFilters; 