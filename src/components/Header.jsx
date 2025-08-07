import React from 'react';
import { AppBar, Toolbar, Typography, Box, styled, } from '@mui/material';
import Logo from '../assets/corpico_logo.svg';

const StyledAppBar = styled(AppBar)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.main,
    color: theme.palette.success.main,
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, .14), 0 7px 10px -5px rgba(0, 0, 0, .4)',
    position: 'relative',
    overflow: 'hidden',
    height: '65px',
    borderRadius: 0,
  };
});

const GradientLine = styled(Box)(({ theme }) => {
  const borderColorsForGradient = [
    theme.palette.corpico.azul,
    theme.palette.corpico.violeta,
    theme.palette.corpico.rojo,
    theme.palette.corpico.naranja,
    theme.palette.corpico.amarillo,
    theme.palette.corpico.verde,
    theme.palette.corpico.celeste,
  ];

  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(to right, ${borderColorsForGradient.join(', ')})`,
  };
});

const Header = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ minHeight: '60px', height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <a href="https://www.corpico.com.ar" target="_blank" rel="noopener noreferrer">
            <img src={Logo} alt="Corpico" style={{ height: '40px', marginRight: '10px' }} />
          </a>
        </Box>
        {/* Título */}
        <Typography
          variant="h5"
          sx={{ flexGrow: 1, textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} >
          Solicitud de Interferencias
        </Typography>
        {/* Box oculto para centrar título */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="Corpico" style={{ height: '40px', marginRight: '10px', visibility: 'hidden' }} />
        </Box>
      </Toolbar>
      <GradientLine />
    </StyledAppBar>
  );
};

export default Header;