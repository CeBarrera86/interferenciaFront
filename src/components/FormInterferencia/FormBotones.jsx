import React from 'react';
import { Box, Button } from '@mui/material';

export default function FormBotones({ onSubmit }) {
  const handleVolverClick = () => {
    window.location.href = 'https://corpico.com.ar/';
  };

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2,
      flexWrap: 'wrap', '& > button': { flexGrow: 1, minWidth: '120px', maxWidth: '180px', },
    }}>
      <Button variant="contained" type="submit" onClick={onSubmit} sx={{ textTransform: 'uppercase' }} >
        Crear
      </Button>
      <Button variant="outlined" onClick={handleVolverClick} sx={{ textTransform: 'uppercase' }} >
        Volver
      </Button>
    </Box>
  );
}