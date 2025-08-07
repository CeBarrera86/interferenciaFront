import React, { useCallback } from 'react';
import { Box, Typography, Grid, FormControl, Button } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormUbicacion({ control, errors, onFileChange, isFileUploadDisabled, mapScreenshotActive, currentAdjunto, onClearAttachment }) {
  const handleInternalFileChange = useCallback((event, onChange) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / (1024 * 1024); // Tamaño en MB
      const fileType = file.type;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxFileSizeMB = 5;

      if (!allowedTypes.includes(fileType)) {
        console.error('Tipo de archivo no permitido:', fileType);
        event.target.value = null; // Limpiar el input file si el tipo es incorrecto
        onChange(null);
        onFileChange(null);
        return;
      }
      if (fileSize > maxFileSizeMB) {
        console.error('Archivo demasiado grande:', fileSize.toFixed(2), 'MB. Máximo', maxFileSizeMB, 'MB.');
        event.target.value = null; // Limpiar el input file si es demasiado grande
        onChange(null);
        onFileChange(null);
        return;
      }
      onChange(file);
      onFileChange(file);
    } else {
      onChange(null);
      onFileChange(null);
    }
  }, [onFileChange]);

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Adjuntar archivos
      </Typography>
      <Grid container direction="row" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "center", }}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.SOI_ADJUNTO}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tamaño máximo 5MB. (PDF, JPG, PNG)
            </Typography>
            <Controller
              name="SOI_ADJUNTO"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', position: 'relative' }}
                    disabled={isFileUploadDisabled}
                  >
                    {currentAdjunto ? (mapScreenshotActive ? 'Captura del Mapa' : currentAdjunto.name) : 'Seleccionar archivo'}
                    <input type="file" onChange={(e) => handleInternalFileChange(e, onChange)} accept=".pdf, .jpg, .jpeg, .png" {...restField}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                      disabled={isFileUploadDisabled} />
                  </Button>
                  {currentAdjunto && (
                    <Button variant="text" color="error" onClick={onClearAttachment} sx={{ flexShrink: 0 }} >
                      Limpiar
                    </Button>
                  )}
                </Box>
              )}
            />
            {errors.SOI_ADJUNTO && (
              <Typography variant="caption" color="error"> {errors.SOI_ADJUNTO?.message} </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box >
  );
}