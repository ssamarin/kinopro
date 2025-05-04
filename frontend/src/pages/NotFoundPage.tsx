import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 6, maxWidth: 480, width: '100%', borderRadius: 5, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <MovieIcon sx={{ fontSize: 64, color: 'primary.main', mb: 1 }} />
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: 80, color: 'primary.main', mb: 1, lineHeight: 1 }}>
            404
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Страница не найдена
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Возможно, вы ошиблись адресом или страница была удалена.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontWeight: 700, fontSize: 18, borderRadius: 3 }}
        >
          На главную
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage; 