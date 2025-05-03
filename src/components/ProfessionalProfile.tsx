import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Rating, 
  Chip,
  Avatar,
  Card,
  CardMedia,
  Tab,
  Tabs
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

interface Professional {
  id: number;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  experience: string;
  location: string;
  photo: string;
  bio: string;
  works: {
    id: number;
    title: string;
    image: string;
  }[];
  skills: string[];
}

const ProfileContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '100%',
  backgroundColor: '#150E19',
  color: '#ffffff',
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const BackButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}));

const ProfilePhoto = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '20%',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiTab-root": {
    color: '#9e9e9e',
    "&.Mui-selected": {
      color: '#ffffff',
    }
  },
  "& .MuiTabs-indicator": {
    backgroundColor: '#ffffff',
  }
}));

const WorksGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const WorkCard = styled(Card)(({ theme }) => ({
  height: 180,
  borderRadius: theme.spacing(1),
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: '#333333',
  color: '#ffffff',
}));

const ContactButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#000000',
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
  "&:hover": {
    backgroundColor: '#e0e0e0',
  }
}));

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

const ProfessionalProfile: React.FC = () => {
  console.log('Rendering ProfessionalProfile component');
  const [tabValue, setTabValue] = React.useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // Mock data for the professional
  const professional: Professional = {
    id: 1,
    name: 'Тимур Бабенко',
    profession: 'Режиссер',
    rating: 4.8,
    reviewCount: 24,
    experience: '8 лет',
    location: 'Москва',
    photo: 'https://source.unsplash.com/random/200x200?man',
    bio: 'Режиссер с опытом работы над документальными фильмами и рекламными роликами. Специализируюсь на создании атмосферных видео с акцентом на эмоциональную составляющую.',
    works: [
      { id: 1, title: 'Проект 1', image: 'https://source.unsplash.com/random/300x180?film' },
      { id: 2, title: 'Проект 2', image: 'https://source.unsplash.com/random/300x180?movie' },
      { id: 3, title: 'Проект 3', image: 'https://source.unsplash.com/random/300x180?cinema' },
      { id: 4, title: 'Проект 4', image: 'https://source.unsplash.com/random/300x180?director' },
    ],
    skills: ['Режиссура', 'Монтаж', 'Сценарий', 'Операторская работа', 'Английский']
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <BackButton onClick={handleBack}>
          <ArrowBackIcon />
        </BackButton>
        <Typography variant="h6" component="div">
          Профиль
        </Typography>
        <Box sx={{ width: 24 }} /> {/* Spacer for alignment */}
      </ProfileHeader>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <ProfilePhoto src={professional.photo} alt={professional.name} />
        <Typography variant="h5" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
          {professional.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
          <Rating value={professional.rating} precision={0.1} readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {professional.rating} ({professional.reviewCount} отзывов)
          </Typography>
        </Box>
        
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {professional.profession}
        </Typography>
        <Typography color="text.secondary">
          {professional.location}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button variant="contained" color="primary" fullWidth>
          Редактировать
        </Button>
      </Box>

      <Box sx={{ backgroundColor: '#231930', borderRadius: 2, p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Ваш статус на hh.ru
          </Typography>
          <Box>▼</Box>
        </Box>
        <Chip label="Не ищу работу" sx={{ backgroundColor: '#503810', color: '#E8B557' }} />
      </Box>

      <Box sx={{ backgroundColor: '#231930', borderRadius: 2, p: 2, mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Видео о себе
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Запишите работодателям видео о своём опыте и навыках
        </Typography>
        <Button variant="outlined" sx={{ borderColor: 'white', color: 'white' }}>
          Записать
        </Button>
      </Box>

      <Box sx={{ backgroundColor: '#231930', borderRadius: 2, p: 2, mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Подтверждение языков
        </Typography>
        <Box sx={{ backgroundColor: '#333333', borderRadius: 2, p: 2, mb: 2 }}>
          <Typography variant="body2">
            Подтверждайте языки — это выделит вас среди других кандидатов
          </Typography>
        </Box>
        <Chip label="Английский" sx={{ backgroundColor: '#333333', color: 'white' }} />
      </Box>

      <StyledTabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        <Tab label="О себе" />
        <Tab label="Работы" />
        <Tab label="Отзывы" />
      </StyledTabs>

      {tabValue === 0 && (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {professional.bio}
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Опыт работы
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {professional.experience}
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Навыки
          </Typography>
          <Box sx={{ mb: 3 }}>
            {professional.skills.map((skill) => (
              <SkillChip key={skill} label={skill} />
            ))}
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {professional.works.map((work) => (
              <Grid key={work.id} item xs={6}>
                <WorkCard>
                  <CardMedia
                    component="img"
                    height="180"
                    image={work.image}
                    alt={work.title}
                  />
                </WorkCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tabValue === 2 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1">
            Отзывы: {professional.reviewCount}
          </Typography>
        </Box>
      )}

      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, backgroundColor: '#150E19' }}>
        <ContactButton variant="contained" fullWidth>
          Написать
        </ContactButton>
      </Box>
    </ProfileContainer>
  );
};

export default ProfessionalProfile;