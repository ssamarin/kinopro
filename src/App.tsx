import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ProfessionalsPage from './pages/ProfessionalsPage';
import ProfessionalProfile from './components/ProfessionalProfile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProfessionalsPage />} />
          <Route path="/professionals/:id" element={<ProfessionalProfile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
