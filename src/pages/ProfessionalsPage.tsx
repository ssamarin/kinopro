import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import SearchAndFilters from '../components/SearchAndFilters';
import ProfessionalsList from '../components/ProfessionalsList';

const ProfessionalsPage: React.FC = () => {
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Поиск специалистов
        </Typography>
        <SearchAndFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        <ProfessionalsList />
      </Box>
    </Container>
  );
};

export default ProfessionalsPage; 