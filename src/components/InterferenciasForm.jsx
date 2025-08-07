import React from 'react';
import {
  Box,
  Paper,
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FormArchivos from './FormInterferencia/FormArchivos';
import FormServicios from './FormInterferencia/FormServicios';
import FormSolicitante from './FormInterferencia/FormSolicitante';
import FormUbicacion from './FormInterferencia/FormUbicacion';
import FormFechas from './FormInterferencia/FormFechas';
import FormBotones from './FormInterferencia/FormBotones';
import MapComponent from './MapComponent/MapComponent';
import { useLocalidades } from '../hooks/useLocalidades';
import { useInterferenciaForm } from '../hooks/useInterferenciaForm';

export default function InterferenciasForm() {
  const theme = useTheme();
  const { localidades, loadingLocalidades, errorLocalidades } = useLocalidades();
  const {
    control,
    handleSubmit,
    errors,
    currentLat,
    currentLng,
    existingAdjunto,
    mapScreenshotData,
    openMapPreview,
    activeAttachmentType,
    handleMapScreenshot,
    handleFormUbicacionFileChange,
    handleCloseMapPreview,
    handleMapClick,
    cleanAttachment,
    onSubmit,
    openSuccessDialog,
    successMessage,
    interferenciaId,
    resetFormAndMap,
    openErrorDialog,
    errorMessage,
    errorDetails,
    handleErrorDialogClose,
    setDrawnShapes,
    canCaptureMap,
  } = useInterferenciaForm();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', }} >
        {/* Primer Panel: Formulario de Interferencia */}
        <Box sx={{ flex: '1 1 500px' }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Registrar Nueva Interferencia</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormServicios control={control} errors={errors} />
              <FormSolicitante control={control} errors={errors} />
              <FormUbicacion control={control} errors={errors} localidades={localidades} />
              <FormArchivos
                control={control}
                errors={errors}
                onFileChange={handleFormUbicacionFileChange}
                isFileUploadDisabled={activeAttachmentType === 'map'}
                mapScreenshotActive={activeAttachmentType === 'map'}
                currentAdjunto={existingAdjunto}
                onClearAttachment={cleanAttachment}
              />
              <FormFechas control={control} errors={errors} />
              <FormBotones />
            </form>
          </Paper>
        </Box>
        {/* Segundo Panel: Zona de Interferencia */}
        <Box sx={{ flex: '1 1 500px' }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Zona de Interferencia</Typography>
            <MapComponent
              center={{ lat: currentLat, lng: currentLng }}
              zoom={13}
              onMapClick={handleMapClick}
              markerPosition={{ lat: currentLat, lng: currentLng }}
              onMapScreenshot={handleMapScreenshot}
              disableCaptureButton={!canCaptureMap || activeAttachmentType === 'file'}
              onDrawnShapesChange={setDrawnShapes}
            />
          </Paper>
        </Box>
      </Box>
      {/* Vista Previa del Mapa */}
      <Dialog open={openMapPreview} onClose={handleCloseMapPreview} maxWidth="md" fullWidth >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Vista Previa del Mapa Capturado</Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseMapPreview} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {mapScreenshotData ? (
            <img src={mapScreenshotData} alt="Mapa Capturado"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          ) : (
            <Typography>No hay imagen de mapa para previsualizar.</Typography>
          )}
        </DialogContent>
      </Dialog>
      {/* Mensaje de Éxito */}
      <Dialog open={openSuccessDialog} onClose={resetFormAndMap} maxWidth="sm" fullWidth>
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
            <IconButton edge="end" color="inherit" onClick={resetFormAndMap} aria-label="close"
              sx={{ color: theme.palette.success.contrastText }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 1.5, fontSize: '1.1rem', color: theme.palette.text.primary }}>
            {successMessage}
          </Typography>
          {interferenciaId && (
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
              N° de interferencia: <span style={{ color: theme.palette.primary.main }}>{interferenciaId}</span>
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              onClick={resetFormAndMap}
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
      {/* Diálogo de Error */}
      <Dialog open={openErrorDialog} onClose={handleErrorDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          backgroundColor: theme.palette.error.main, color: theme.palette.error.contrastText,
          pb: 1, pt: 2, borderBottom: `1px solid ${theme.palette.error.dark}`,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ErrorOutlineIcon sx={{ color: theme.palette.error.contrastText, fontSize: '2rem' }} />
              <Typography variant="h6" sx={{ color: theme.palette.error.contrastText, fontWeight: 'bold' }}>
                ¡Error al Guardar!
              </Typography>
            </Box>
            <IconButton edge="end" color="inherit" onClick={handleErrorDialogClose} aria-label="close"
              sx={{ color: theme.palette.error.contrastText }} >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 1.5, fontSize: '1.1rem', color: theme.palette.text.primary }}>
            {errorMessage}
          </Typography>
          {errorDetails && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
              Detalles: {errorDetails}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained" onClick={handleErrorDialogClose} color="error"
              sx={{
                minWidth: '120px', boxShadow: `0px 4px 8px ${theme.palette.error.light}`,
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                },
              }} >
              Entendido
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}