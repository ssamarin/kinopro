import React from 'react';
import { Box } from '@mui/material';
import ProfessionalCard from './ProfessionalCard';

interface Professional {
  id: number;
  name: string;
  profession: string;
  rating: number;
  experience: string;
  location: string;
  photo: string;
}

const mockProfessionals: Professional[] = [
  {
    id: 1,
    name: 'Анна Иванова',
    profession: 'Гример',
    rating: 4.8,
    experience: '5 лет',
    location: 'Москва',
    photo: 'https://source.unsplash.com/random/200x200?makeup',
  },
  {
    id: 2,
    name: 'Петр Сидоров',
    profession: 'Оператор',
    rating: 4.9,
    experience: '8 лет',
    location: 'Санкт-Петербург',
    photo: 'https://source.unsplash.com/random/200x200?camera',
  },
  {
    id: 3,
    name: 'Мария Петрова',
    profession: 'Режиссер',
    rating: 4.7,
    experience: '10 лет',
    location: 'Москва',
    photo: 'https://source.unsplash.com/random/200x200?director',
  },
];

const ProfessionalsList: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      {mockProfessionals.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </Box>
  );
};

export default ProfessionalsList; 