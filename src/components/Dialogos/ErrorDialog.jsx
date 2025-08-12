// src/components/Dialogos/ErrorDialog.jsx
import React from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ErrorDialog({ open, onClose, message, details }) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        pb: 1,
        pt: 2,
        borderBottom: `1px solid ${theme.palette.error.dark}`,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ErrorOutlineIcon sx={{ color: theme.palette.error.contrastText, fontSize: '2rem' }} />
            <Typography variant="h6" sx={{ color: theme.palette.error.contrastText, fontWeight: 'bold' }}>
              ¡Error al Guardar!
            </Typography>
          </Box>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close"
            sx={{ color: theme.palette.error.contrastText }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 1.5, fontSize: '1.1rem', color: theme.palette.text.primary }}>
          {message}
        </Typography>
        {details && (
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
            Detalles: {details}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={onClose}
            color="error"
            sx={{
              minWidth: '120px',
              boxShadow: `0px 4px 8px ${theme.palette.error.light}`,
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }} >
            Entendido
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}