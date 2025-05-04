import React from 'react';
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
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

interface Option {
  label: string;
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
  onSearchChange: (value: string) => void;
  filters: {
    profession: string;
    experience: string;
    location: string;
    ratingFrom?: string;
    ratingTo?: string;
    onlyWithPhoto?: boolean;
    onlyWithReviews?: boolean;
  };
  onFilterChange: (filter: string, value: string | boolean) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
}) => {
  // Для Range Slider
  const ratingRange: [number, number] = [
    filters.ratingFrom ? Number(filters.ratingFrom) : 0,
    filters.ratingTo ? Number(filters.ratingTo) : 5,
  ];

  const handleRatingChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onFilterChange('ratingFrom', String(newValue[0]));
      onFilterChange('ratingTo', String(newValue[1]));
    }
  };

  return (
    <StyledPaper elevation={0}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', mb: 2 }}>
        <Box sx={{ flex: '1 1 260px', minWidth: 220 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Поиск по имени или профессии"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 220px', minWidth: 180 }}>
          <ProfessionAutocomplete
            options={professions}
            getOptionLabel={(option: any) => option.label}
            value={professions.find((p) => p.label === filters.profession) || null}
            onChange={(_, value) => onFilterChange('profession', (value as Option)?.label || '')}
            renderInput={(params) => (
              <StyledTextField {...params} label="Профессия" variant="outlined" />
            )}
            isOptionEqualToValue={(option: any, value: any) => option.label === value.label}
            noOptionsText="Нет подходящих профессий"
          />
        </Box>
        <Box sx={{ flex: '1 1 220px', minWidth: 180 }}>
          <CityAutocomplete
            options={locations}
            getOptionLabel={(option: any) => option.label}
            value={locations.find((l) => l.label === filters.location) || null}
            onChange={(_, value) => onFilterChange('location', (value as Option)?.label || '')}
            renderInput={(params) => (
              <StyledTextField {...params} label="Город" variant="outlined" />
            )}
            isOptionEqualToValue={(option: any, value: any) => option.label === value.label}
            noOptionsText="Нет подходящих городов"
          />
        </Box>
      </Box>
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 18 }}>
            Рейтинг: <b>{ratingRange[0].toFixed(1)}</b> — <b>{ratingRange[1].toFixed(1)}</b>
          </Typography>
        </Box>
        <ColoredSlider
          value={ratingRange}
          min={0}
          max={5}
          step={0.1}
          onChange={handleRatingChange}
          valueLabelDisplay="auto"
          marks={[]}
        />
      </Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControlLabel
          control={
            <StyledCheckbox
              checked={!!filters.onlyWithPhoto}
              onChange={(_, checked) => onFilterChange('onlyWithPhoto', checked)}
            />
          }
          label="Только с фото"
        />
        <FormControlLabel
          control={
            <StyledCheckbox
              checked={!!filters.onlyWithReviews}
              onChange={(_, checked) => onFilterChange('onlyWithReviews', checked)}
            />
          }
          label="Только с отзывами"
        />
        <Box sx={{ flexGrow: 1 }} />
        <StyledButton variant="contained" size="large" fullWidth={false}>
          Показать
        </StyledButton>
      </Stack>
    </StyledPaper>
  );
};

export default SearchAndFilters; 