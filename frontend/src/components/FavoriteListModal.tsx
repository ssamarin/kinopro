import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

interface FavoriteList {
  id: number;
  title: string;
  description: string;
  list_of_ids: number[];
  owner_user_id: number;
  created_at: string;
  updated_at: string;
}

interface FavoriteListModalProps {
  open: boolean;
  onClose: () => void;
  professionalId: number;
  professionalName: string;
}

const FavoriteListModal: React.FC<FavoriteListModalProps> = ({
  open,
  onClose,
  professionalId,
  professionalName
}) => {
  const { isAuthenticated } = useAuth();
  const [lists, setLists] = useState<FavoriteList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [addingToList, setAddingToList] = useState(false);

  // Загрузка списков избранного
  useEffect(() => {
    if (open && isAuthenticated) {
      fetchLists();
    }
  }, [open, isAuthenticated]);

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

  // Создание нового списка избранного
  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      setError('Название списка обязательно');
      return;
    }
    
    setCreatingList(true);
    setError('');
    
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newListTitle.trim(),
          description: newListDescription.trim(),
          list_of_ids: [professionalId]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось создать список');
      }
      
      const newList = await response.json();
      setLists(prev => [newList, ...prev]);
      setShowCreateForm(false);
      setNewListTitle('');
      setNewListDescription('');
      setSuccess(`Профессионал ${professionalName} добавлен в новый список "${newListTitle}"`);
      
      // Сбрасываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании списка');
      console.error('Ошибка при создании списка:', err);
    } finally {
      setCreatingList(false);
    }
  };

  // Добавление профессионала в существующий список
  const handleAddToList = async (listId: number, listTitle: string) => {
    setAddingToList(true);
    setError('');
    
    try {
      const response = await fetch(`/api/participants/${listId}/professionals/${professionalId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось добавить профессионала в список');
      }
      
      setSuccess(`Профессионал ${professionalName} добавлен в список "${listTitle}"`);
      
      // Сбрасываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при добавлении в список');
      console.error('Ошибка при добавлении в список:', err);
    } finally {
      setAddingToList(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Добавить в избранное</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
        
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Добавить профессионала {professionalName} в список:
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {!showCreateForm && (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                fullWidth
                onClick={() => setShowCreateForm(true)}
                sx={{ mb: 2 }}
              >
                Создать новый список
              </Button>
            )}
            
            {showCreateForm && (
              <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Создать новый список
                </Typography>
                <TextField
                  label="Название списка"
                  fullWidth
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  margin="normal"
                  size="small"
                  required
                />
                <TextField
                  label="Описание (необязательно)"
                  fullWidth
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  margin="normal"
                  size="small"
                  multiline
                  rows={2}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                  <Button 
                    variant="text" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewListTitle('');
                      setNewListDescription('');
                    }}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleCreateList}
                    disabled={!newListTitle.trim() || creatingList}
                  >
                    {creatingList ? 'Создание...' : 'Создать'}
                  </Button>
                </Box>
              </Box>
            )}
            
            {lists.length > 0 ? (
              <List sx={{ width: '100%' }}>
                <Typography variant="subtitle2" sx={{ ml: 2, mb: 1, color: 'text.secondary' }}>
                  Существующие списки:
                </Typography>
                {lists.map((list) => (
                  <React.Fragment key={list.id}>
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => handleAddToList(list.id, list.title)}
                        disabled={addingToList || list.list_of_ids.includes(professionalId)}
                      >
                        <ListItemText 
                          primary={list.title} 
                          secondary={
                            list.list_of_ids.includes(professionalId) 
                              ? 'Уже в списке' 
                              : list.description || `${list.list_of_ids.length} профессионалов`
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              !showCreateForm && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 3 }}>
                  У вас пока нет списков избранного. Создайте новый список!
                </Typography>
              )
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FavoriteListModal; 