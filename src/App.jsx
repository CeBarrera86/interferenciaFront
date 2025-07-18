import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import theme from './styles/theme';
import Header from './components/Header';
import InterferenciasForm from './components/InterferenciasForm';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
              <Routes>
                <Route path="/" element={<InterferenciasForm />} />
              </Routes>
            </Box>
            <Footer />
          </Router>
        </LocalizationProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;