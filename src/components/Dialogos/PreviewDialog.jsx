import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PreviewDialog({ open, onClose, imagen }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>
        Vista previa
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <img
          src={imagen}
          alt="Vista previa"
          style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', margin: '0 auto' }}
        />
      </DialogContent>
    </Dialog>
  );
}
