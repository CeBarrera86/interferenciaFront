// src/components/Dialogos/SuccessDialog.jsx
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function SuccessDialog({ open, onClose, message, id }) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        pb: 1,
        pt: 2,
        borderBottom: `1px solid ${theme.palette.success.dark}`,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircleOutlineIcon sx={{ color: theme.palette.success.contrastText, fontSize: '2rem' }} />
            <Typography variant="h6" sx={{ color: theme.palette.success.contrastText, fontWeight: 'bold' }}>
              ¡Interferencia Generada!
            </Typography>
          </Box>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close"
            sx={{ color: theme.palette.success.contrastText }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 1.5, fontSize: '1.1rem', color: theme.palette.text.primary }}>
          {message}
        </Typography>
        {id && (
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
            N° de interferencia: <span style={{ color: theme.palette.primary.main }}>{id}</span>
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={onClose}
            color="success"
            sx={{
              minWidth: '120px',
              boxShadow: `0px 4px 8px ${theme.palette.success.light}`,
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }} >
            Aceptar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}