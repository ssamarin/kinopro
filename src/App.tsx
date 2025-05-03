import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfessionalsPage from './pages/ProfessionalsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import FavoritesPage from './pages/FavoritesPage';
import { FavoritesProvider } from './context/FavoritesContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5B3CC4',
      light: '#7C5DC9',
      dark: '#3C2477',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFB300',
      contrastText: '#fff',
    },
    background: {
      default: '#18181b',
      paper: '#232326',
    },
    text: {
      primary: '#fff',
      secondary: '#a1a1aa',
    },
    divider: '#27272a',
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, fontWeight: 600, fontSize: 16 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 20, background: '#232326' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, background: '#232326', color: '#fff' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { background: '#232326', color: '#fff' },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProfessionalsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;
