import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

function Footer() {
  const theme = useTheme();

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
    <Box
      component="footer"
      sx={{
        width: '100%',
        color: 'text.secondary',
        bgcolor: theme.palette.corpico.amarillo,
        py: 2,
        mt: 'auto',
        borderTop: '5px solid',
        borderImageSlice: 1,
        borderImageSource: `linear-gradient(to right, ${borderColorsForGradient.join(', ')})`,
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="caption">
        COOPERATIVA REGIONAL DE ELECTRICIDAD. OBRAS Y OTROS SERVICIOS DE GENERAL PICO LIMITADA. Mat. Nacional Nº1761. Mat. Provincial Nº1 (La Pampa)
      </Typography>
    </Box>
  );
}

export default Footer;