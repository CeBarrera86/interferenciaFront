// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material'; // Importa useTheme
import corpicoLogo from '../assets/Corpico_logo.svg'; // Importa el logo SVG

function Header() {
  const theme = useTheme(); // Accede al objeto del tema

  // Define los colores del borde utilizando las propiedades de theme.palette.corpico
  const borderColorsForGradient = [
    theme.palette.corpico.azul,
    theme.palette.corpico.violeta,
    theme.palette.corpico.rojo,
    theme.palette.corpico.naranja,
    theme.palette.corpico.amarillo,
    theme.palette.corpico.verde,
    theme.palette.corpico.celeste,
  ];

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: '#f5f5f5',
        color: theme.palette.corpico.verde,
        borderBottom: '5px solid',
        borderImageSlice: 1,
        borderImageSource: `linear-gradient(to right, ${borderColorsForGradient.join(', ')})`,
        boxSizing: 'border-box',
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo a la izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <a href="https://www.corpico.com.ar" target="_blank" rel="noopener noreferrer">
            <img
              src={corpicoLogo}
              alt="Logo Corpico"
              style={{ height: '40px', marginRight: '16px' }}
            />
          </a>
        </Box>

        {/* Título centrado */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Interferencias Corpico
        </Typography>

        <Box sx={{ width: '112.91px' }} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;