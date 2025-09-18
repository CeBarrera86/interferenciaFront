import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function FormBotones() {
  const navigate = useNavigate();

  const handleVolverClick = () => {
    window.location.href = 'https://corpico.com.ar/';
    // O si querés navegar internamente: navigate('/');
  };

  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    mt: 2,
    flexWrap: 'wrap',
    '& > button': {
      flexGrow: 1,
      minWidth: '120px',
      maxWidth: '180px',
    },
  };

  return (
    <Box sx={buttonContainerStyles}>
      <Button variant="contained" type="submit" color="success" sx={{ textTransform: 'uppercase' }}>
        Crear
      </Button>
      <Button variant="outlined" onClick={handleVolverClick} color="error" sx={{ textTransform: 'uppercase' }}>
        Volver
      </Button>
    </Box>
  );
}