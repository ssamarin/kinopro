import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
  professionalId: number;
  professionalName: string;
  userId: number;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ professionalId, professionalName, userId, onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    if (!isAuthenticated) {
      setError('Необходимо войти в систему, чтобы оставить отзыв');
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRating(null);
    setText('');
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Пожалуйста, поставьте оценку');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating,
          text,
          reviewed_user_id: userId
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось отправить отзыв');
      }
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onReviewAdded();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке отзыва');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outlined" 
        onClick={handleOpen}
        sx={{ 
          mt: 2, 
          borderRadius: 2,
          textTransform: 'none',
          fontSize: 14
        }}
      >
        Оставить отзыв
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Отзыв о специалисте: {professionalName}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Ваш отзыв успешно добавлен!
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography component="legend" sx={{ mb: 1 }}>
              Ваша оценка*
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              precision={0.5}
              size="large"
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Ваш отзыв"
              multiline
              rows={4}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Расскажите о вашем опыте работы с этим специалистом"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!rating || loading || success}
          >
            {loading ? 'Отправка...' : 'Отправить отзыв'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewForm; 