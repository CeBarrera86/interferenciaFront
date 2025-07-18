import React from 'react';
import { Button, useTheme } from '@mui/material';
import { forwardRef } from 'react';

const MapButton = forwardRef(({ onClick, disabled }, ref) => {
  const theme = useTheme();

  return (
    <Button ref={ref} variant="contained" onClick={onClick} disabled={disabled}
      sx={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
        backgroundColor: theme.palette.corpico.azul,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.grey[400],
          color: theme.palette.grey[700],
        },
      }}
    >
      Capturar Mapa
    </Button>
  );
});

export default MapButton;