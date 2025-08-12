// src/components/Dialogos/MapPreviewDialog.jsx
import React from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function MapPreviewDialog({ open, onClose, mapScreenshotData }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Vista Previa del Mapa Capturado</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {mapScreenshotData ? (
          <img
            src={mapScreenshotData}
            alt="Mapa Capturado"
            style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        ) : (
          <Typography>No hay imagen de mapa para previsualizar.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}