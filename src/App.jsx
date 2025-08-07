import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);
import appTheme from './styles/theme';
import Header from './components/Header';
import InterferenciasForm from './components/InterferenciasForm';
import Footer from './components/Footer';

function App() {
  dayjs.locale('es');
  const theme = appTheme('light'); // O 'dark'

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