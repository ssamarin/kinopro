import React, { useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import SearchAndFilters from '../components/SearchAndFilters';
import ProfessionalsList from '../components/ProfessionalsList';
import { styled } from '@mui/material/styles';
import { Card, Button } from '@mui/material';

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

  const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(2),
    transition: 'transform 0.2s',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    '&:hover': {
      transform: 'scale(1.02)',
    },
  }));

  const ProfileContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: '100%',
    width: '100vw',
    margin: 0,
    marginLeft: 'calc(-50vw + 50%)',
    marginRight: 'calc(-50vw + 50%)',
    backgroundColor: '#150E19',
    color: '#ffffff',
    boxSizing: 'border-box',
  }));

  return (
    <Container maxWidth={false} sx={{ backgroundColor: '#150E19', padding: 2 }}>
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ color: 'primary.main', fontWeight: 'bold' }}
        >
          Поиск специалистов
        </Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: 'background.paper',
            borderRadius: 2 
          }}
        >
          <SearchAndFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </Paper>
        <ProfessionalsList />
      </Box>
    </Container>
  );
};

export default ProfessionalsPage; 