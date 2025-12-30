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
  const imageStyles = {
    maxWidth: '100%',
    maxHeight: '80vh',
    display: 'block',
    margin: '0 auto',
    borderRadius: 4,
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={headerStyles}>
          <Typography variant="h6">Vista Previa del Mapa Capturado</Typography>
          <IconButton onClick={onClose} aria-label="Cerrar vista previa del mapa">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {mapScreenshotData ? (
          <img src={mapScreenshotData} alt="Mapa Capturado" style={imageStyles} />
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay imagen de mapa para previsualizar.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}