import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PreviewDialog({ open, onClose, imagen }) {
  const dialogTitleStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    pr: 1,
  };

  const imageStyles = {
    maxWidth: '100%',
    maxHeight: '80vh',
    display: 'block',
    margin: '0 auto',
    borderRadius: 4,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={dialogTitleStyles}>
          <Typography variant="h6">Vista previa</Typography>
          <IconButton onClick={onClose} aria-label="Cerrar vista previa">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {imagen ? (
          <img src={imagen} alt="Vista previa" style={imageStyles} />
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay imagen disponible para mostrar.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}