import { Dialog, DialogContent, CircularProgress, Typography, Box } from "@mui/material";

const WaitDialog = ({ open }) => {
  return (
    <Dialog open={open} aria-label="Espere un momento" PaperProps={{ sx: { borderRadius: 3, p: 2 } }}>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
          <CircularProgress size={60} thickness={5} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Espere un momento...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Estamos procesando su solicitud
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WaitDialog;