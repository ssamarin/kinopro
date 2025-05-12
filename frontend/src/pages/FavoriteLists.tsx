import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

interface FavoriteList {
  id: number;
  title: string;
  description: string;
  list_of_ids: number[];
  owner_user_id: number;
  created_at: string;
  updated_at: string;
}

const FavoriteLists: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<FavoriteList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Состояния для модального окна создания/редактирования
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<FavoriteList | null>(null);
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  
  // Загрузка списков при монтировании
  useEffect(() => {
    if (isAuthenticated) {
      fetchLists();
    }
  }, [isAuthenticated]);

  const fetchLists = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/participants', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить списки избранного');
      }
      
      const data = await response.json();
      setLists(data);
    } catch (err) {
      setError('Ошибка при загрузке списков избранного');
      console.error('Ошибка при загрузке списков избранного:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!listTitle.trim()) {
      setError('Название списка обязательно');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const url = editingList 
        ? `/api/participants/${editingList.id}`
        : '/api/participants';
        
      const method = editingList ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: listTitle.trim(),
          description: listDescription.trim(),
          list_of_ids: editingList ? editingList.list_of_ids : []
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось сохранить список');
      }
      
      const updatedList = await response.json();
      
      if (editingList) {
        setLists(prev => prev.map(list => 
          list.id === editingList.id ? updatedList : list
        ));
        setSuccess('Список успешно обновлен');
      } else {
        setLists(prev => [updatedList, ...prev]);
        setSuccess('Список успешно создан');
      }
      
      handleCloseModal();
      
      // Сбрасываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении списка');
      console.error('Ошибка при сохранении списка:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот список?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/participants/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить список');
      }
      
      setLists(prev => prev.filter(list => list.id !== listId));
      setSuccess('Список успешно удален');
      
      // Сбрасываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Ошибка при удалении списка');
      console.error('Ошибка при удалении списка:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (list: FavoriteList) => {
    setEditingList(list);
    setListTitle(list.title);
    setListDescription(list.description || '');
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingList(null);
    setListTitle('');
    setListDescription('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingList(null);
    setListTitle('');
    setListDescription('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate('/')} 
              sx={{ mr: 1 }}
              aria-label="На главную"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Списки избранного
            </Typography>
            <Button
              component={RouterLink}
              to="/favorites"
              startIcon={<FavoriteIcon />}
              variant="text"
              sx={{ ml: 2, fontWeight: 600 }}
            >
              К избранному
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Создать список
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading && !lists.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {lists.map((list) => (
              <React.Fragment key={list.id}>
                <ListItem>
                  <ListItemText
                    primary={list.title}
                    secondary={
                      <>
                        {list.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {list.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {list.list_of_ids.length} профессионалов • Создан {new Date(list.created_at).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      component={RouterLink}
                      to={`/favorite-lists/${list.id}`}
                      edge="end" 
                      aria-label="просмотреть"
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="редактировать"
                      onClick={() => handleEdit(list)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="удалить"
                      onClick={() => handleDelete(list.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
            {!lists.length && !loading && (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 4 }}>
                У вас пока нет списков избранного. Создайте новый список!
              </Typography>
            )}
          </List>
        )}

        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingList ? 'Редактировать список' : 'Создать новый список'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Название списка"
              fullWidth
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Описание (необязательно)"
              fullWidth
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>
              Отмена
            </Button>
            <Button 
              onClick={handleCreateOrUpdate}
              variant="contained"
              disabled={!listTitle.trim() || loading}
            >
              {loading ? 'Сохранение...' : (editingList ? 'Сохранить' : 'Создать')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default FavoriteLists; 