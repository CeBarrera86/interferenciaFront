import { Box, Button } from '@mui/material';

export default function FormBotones() {
  const handleVolverClick = () => {
    window.location.href = 'https://corpico.com.ar/';
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