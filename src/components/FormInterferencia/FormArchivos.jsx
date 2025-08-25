import React, { useCallback } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';

export default function FormArchivos({
  errors,
  onFileChange,
  onClearFile,
  fileAdjunto,
}) {
  const handleInternalFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / (1024 * 1024);
      const fileType = file.type;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxFileSizeMB = 5;

      if (!allowedTypes.includes(fileType)) {
        console.error('Tipo de archivo no permitido:', fileType);
        event.target.value = null;
        onFileChange(null);
        return;
      }
      if (fileSize > maxFileSizeMB) {
        console.error('Archivo demasiado grande:', fileSize.toFixed(2), 'MB. Máximo', maxFileSizeMB, 'MB.');
        event.target.value = null;
        onFileChange(null);
        return;
      }
      onFileChange(file);
    } else {
      onFileChange(null);
    }
  }, [onFileChange]);

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Documentos
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Adjuntar archivo (PDF, JPG, PNG - Máx. 5MB)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ justifyContent: 'flex-start', position: 'relative' }}
            >
              {fileAdjunto ? fileAdjunto.name : 'Seleccionar archivo'}
              <input
                type="file"
                onChange={handleInternalFileChange}
                accept=".pdf, .jpg, .jpeg, .png"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </Button>
            {fileAdjunto && (
              <Button variant="text" color="error" onClick={onClearFile} sx={{ flexShrink: 0 }}>
                Limpiar
              </Button>
            )}
          </Box>
          {errors?.SOI_DOCUMENTO && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {errors.SOI_DOCUMENTO.message}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}