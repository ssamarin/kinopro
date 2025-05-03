import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ProfessionalsPage from './pages/ProfessionalsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProfessionalsPage />
    </ThemeProvider>
  );
};

export default App;
