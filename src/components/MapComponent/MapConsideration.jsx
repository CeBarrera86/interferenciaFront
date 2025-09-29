import React, { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function MapConsideration() {
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setMostrarInfo(!mostrarInfo)}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Consideraciones sobre el mapa
        </Typography>
        <IconButton size="small">
          <ExpandMoreIcon sx={{ transform: mostrarInfo ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
        </IconButton>
      </Box>

      <Collapse in={mostrarInfo}>
        <Box sx={{ mt: 1, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>
            El mapa permite ubicar interferencias geográficas mediante pines y zonas dibujadas. Los botones disponibles permiten:
          </Typography>
          <ul style={{ marginTop: 0, paddingLeft: '1.2em' }}>
            <li><strong>Ubicar marcador:</strong> activa el modo para mover el pin de la ubicación seleccionada.</li>
            <li><strong>Dibujar zona:</strong> permite crear un área de interferencia en forma de triángulo o cuadrado/rectángulo.</li>
            <li><strong>Eliminar zona:</strong> borra cualquier dibujo realizado.</li>
            <li><strong>Capturar mapa:</strong> genera una imagen adjunta que se envía junto al formulario.</li>
            <li><strong>Eliminar captura:</strong> quita la imagen adjunta si ya fue tomada.</li>
          </ul>
          <Typography variant="body2" gutterBottom>
            Para realizar la captura, los pines deben estar dentro del área dibujada. Si no se realiza la captura, no se enviará ninguna imagen adjunta.
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
