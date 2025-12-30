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
  const contrast = theme.palette.success.contrastText;

  const HeaderContent = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <CheckCircleOutlineIcon sx={{ color: contrast, fontSize: '2rem' }} />
        <Typography variant="h6" sx={{ color: contrast, fontWeight: 'bold' }}>
          ¡Interferencia Generada!
        </Typography>
      </Box>
      <IconButton onClick={onClose} aria-label="close" sx={{ color: contrast }}>
        <CloseIcon />
      </IconButton>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.success.main,
          color: contrast,
          pb: 1,
          pt: 2,
          borderBottom: `1px solid ${theme.palette.success.dark}`,
        }}
      >
        <HeaderContent />
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 1.5, fontSize: '1.1rem', color: theme.palette.text.primary }}>
          {message}
        </Typography>

        {id && (
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
            N° de interferencia:{' '}
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              {id}
            </Box>
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
            }}
          >
            Aceptar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}