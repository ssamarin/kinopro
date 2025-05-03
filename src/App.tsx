import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import SearchAndFilters from './components/SearchAndFilters';
import ProfessionalsList from './components/ProfessionalsList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    profession: 'all',
    experience: 'all',
    rating: 'all',
    location: 'all',
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <SearchAndFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        <ProfessionalsList />
      </Container>
    </ThemeProvider>
  );
};

export default App;
