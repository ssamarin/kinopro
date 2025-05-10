import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Chip, Menu, MenuItem, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Badge from '@mui/material/Badge';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#18181b',
  color: '#fff',
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.25)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 0, 0, 0),
}));

const CustomBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#fff',
    color: '#18181b',
    fontWeight: 700,
    fontSize: 11,
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)',
    minWidth: 14,
    height: 14,
    padding: '0 2px',
    top: 0,
    right: 0,
  },
}));

const Header: React.FC = () => {
  const { favorites } = useFavorites();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Функция для получения имени пользователя без @
  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Если есть firstName, используем его
    if (user.firstName) {
      return user.firstName;
    }
    
    // Иначе используем имя из email (как было раньше)
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return '';
  };

  // Функция для получения первой буквы имени для аватара
  const getAvatarLetter = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // User (по умолчанию)
  };

  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 4 } }}>
        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
            <MovieIcon sx={{ fontSize: 32, color: '#fff' }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: 1 }}>
              KinoPro
            </Typography>
          </Box>
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton
            component={RouterLink}
            to="/favorites"
            sx={{ color: favorites.length > 0 ? 'error.main' : 'grey.400', mr: 1 }}
            size="large"
            aria-label="Избранное"
          >
            <CustomBadge badgeContent={favorites.length > 0 ? favorites.length : undefined}>
              <FavoriteIcon />
            </CustomBadge>
          </IconButton>
          
          {isAuthenticated && user ? (
            <>
              <Chip
                avatar={
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      fontWeight: 'bold',
                      width: 28,
                      height: 28
                    }}
                  >
                    {getAvatarLetter()}
                  </Avatar>
                }
                label={getUserDisplayName()}
                color="primary"
                onClick={handleClick}
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.95rem',
                  borderRadius: '16px',
                  padding: '4px 2px',
                  backgroundColor: 'rgba(91,60,196,0.15)',
                  '&:hover': { 
                    backgroundColor: 'rgba(91,60,196,0.25)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(91,60,196,0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              />
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'user-menu-button',
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    borderRadius: '12px',
                    minWidth: '200px'
                  },
                  elevation: 3
                }}
                TransitionProps={{
                  style: { 
                    transformOrigin: 'top right'
                  }
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {(user?.firstName || user?.lastName) && (
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    mb: 1
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {`${user?.firstName || ''} ${user?.lastName || ''}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                )}
                <MenuItem 
                  component={RouterLink} 
                  to="/profile" 
                  onClick={handleClose}
                >
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Мой профиль
                </MenuItem>
                <MenuItem 
                  component={RouterLink} 
                  to="/favorite-lists" 
                  onClick={handleClose}
                >
                  <ListAltIcon fontSize="small" sx={{ mr: 1 }} />
                  Управление списками
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                sx={{
                  textTransform: 'none',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.24)',
                  background: 'rgba(255,255,255,0.04)',
                  '&:hover': {
                    borderColor: '#5B3CC4',
                    background: 'rgba(91,60,196,0.08)',
                  },
                }}
                component={RouterLink}
                to="/login"
              >
                Войти
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  textTransform: 'none',
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 rgba(91,60,196,0.15)',
                  fontWeight: 600,
                  borderRadius: 12,
                }}
                component={RouterLink}
                to="/register"
              >
                Зарегистрироваться
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 