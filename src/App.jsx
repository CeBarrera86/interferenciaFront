import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);
dayjs.locale('es');

import corpicoTheme from './styles/theme';
import Header from './components/Layouts/Header';
import Footer from './components/Layouts/Footer';
import InterferenciasForm from './components/InterferenciasForm';

function App() {
  const theme = useMemo(() => corpicoTheme('light'), []); // Cambiar a 'dark' si querés probar

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
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