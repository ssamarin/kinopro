import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { Professional } from '../components/ProfessionalCard';
import ProfessionalsList from '../components/ProfessionalsList';

interface FavoriteList {
  id: number;
  title: string;
  description: string;
  list_of_ids: number[];
  owner_user_id: number;
  created_at: string;
  updated_at: string;
}

const FavoriteListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [list, setList] = useState<FavoriteList | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Загрузка списка и профессионалов при монтировании
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchListAndProfessionals();
    }
  }, [isAuthenticated, id]);
  
  const fetchListAndProfessionals = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Загружаем информацию о списке
      const listResponse = await fetch(`/api/participants/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!listResponse.ok) {
        throw new Error('Не удалось загрузить список избранного');
      }
      
      const listData = await listResponse.json();
      setList(listData);
      
      // Если список пустой, не загружаем профессионалов
      if (listData.list_of_ids.length === 0) {
        setProfessionals([]);
        setLoading(false);
        return;
      }
      
      // Загружаем всех профессионалов
      const professionalsResponse = await fetch('/api/professionals');
      if (!professionalsResponse.ok) {
        throw new Error('Не удалось загрузить данные профессионалов');
      }
      
      const allProfessionals = await professionalsResponse.json();
      
      // Фильтруем только тех, кто в списке
      const listProfessionals = allProfessionals.filter(
        (pro: Professional) => listData.list_of_ids.includes(pro.id)
      );
      
      setProfessionals(listProfessionals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error('Ошибка при загрузке данных:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveProfessional = async (professionalId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого профессионала из списка?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/participants/${id}/professionals/${professionalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить профессионала из списка');
      }
      
      // Обновляем список в UI
      setProfessionals(prev => prev.filter(pro => pro.id !== professionalId));
      
      // Обновляем данные списка
      if (list) {
        setList({
          ...list,
          list_of_ids: list.list_of_ids.filter(id => id !== professionalId)
        });
      }
      
      setSuccess('Профессионал удален из списка');
      
      // Сбрасываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Ошибка при удалении профессионала из списка');
      console.error('Ошибка при удалении профессионала из списка:', err);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="warning">
            Для просмотра списков избранного необходимо авторизоваться
          </Alert>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={() => navigate('/favorite-lists')} 
            sx={{ mr: 1 }}
            aria-label="Назад к спискам"
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton 
            onClick={() => navigate('/')} 
            sx={{ mr: 2 }}
            aria-label="На главную"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {loading ? 'Загрузка...' : list?.title}
          </Typography>
        </Box>
        
        {list?.description && (
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {list.description}
          </Typography>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {professionals.length === 0 ? (
              <Box sx={{ textAlign: 'center', my: 8 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
                  В этом списке пока нет профессионалов
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/"
                  variant="contained"
                >
                  Найти профессионалов
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Профессионалов в списке: {professionals.length}
                </Typography>
                
                <List>
                  {professionals.map(pro => (
                    <React.Fragment key={pro.id}>
                      <ListItem>
                        <ListItemText
                          primary={pro.name}
                          secondary={`${pro.profession}, ${pro.location}`}
                        />
                        <ListItemSecondaryAction>
                          <Button 
                            component={RouterLink}
                            to={`/professionals/${pro.id}`}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Профиль
                          </Button>
                          <IconButton 
                            edge="end" 
                            aria-label="удалить"
                            onClick={() => handleRemoveProfessional(pro.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteListDetail; 