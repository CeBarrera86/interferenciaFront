import React, { useCallback } from 'react';
import { Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormUbicacion({ control, errors, localidades, onFileChange, isFileUploadDisabled, mapScreenshotActive, currentAdjunto, onClearAttachment }) {
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
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, position: 'relative', pt: 4 }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Ubicación Interferencia
      </Typography>
      <Grid container direction="row" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "center", }}>
        <Grid size={{ xs: 6, md: 5 }}>
          <Controller name="SOI_CALLE" control={control} render={({ field }) => (
            <TextField {...field}
              label="Calle"
              type='text'
              fullWidth
              error={!!errors.SOI_CALLE}
              helperText={errors.SOI_CALLE?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Controller name="SOI_ALTURA" control={control} render={({ field }) => (
            <TextField {...field}
              label="Altura"
              type="number"
              fullWidth
              error={!!errors.SOI_ALTURA}
              helperText={errors.SOI_ALTURA?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller name="SOI_PISO" control={control} render={({ field }) => (
            <TextField {...field}
              label="Piso"
              type='text'
              fullWidth
              error={!!errors.SOI_PISO}
              helperText={errors.SOI_PISO?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller name="SOI_DPTO" control={control} render={({ field }) => (
            <TextField {...field}
              label="Dpto"
              type='text'
              fullWidth
              error={!!errors.SOI_DPTO}
              helperText={errors.SOI_DPTO?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller name="SOI_ENTRE1" control={control} render={({ field }) => (
            <TextField {...field}
              label="Entre Calle 1"
              type='text'
              fullWidth
              error={!!errors.SOI_ENTRE1}
              helperText={errors.SOI_ENTRE1?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller name="SOI_ENTRE2" control={control} render={({ field }) => (
            <TextField {...field}
              label="Entre Calle 2"
              type='text'
              fullWidth
              error={!!errors.SOI_ENTRE2}
              helperText={errors.SOI_ENTRE2?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <FormControl component="fieldset" error={!!errors.SOI_VEREDA} fullWidth>
            <FormLabel component="legend">Vereda</FormLabel>
            <Controller name="SOI_VEREDA" control={control} render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="P" control={<Radio />} label="Par" />
                <FormControlLabel value="I" control={<Radio />} label="Impar" />
              </RadioGroup>
            )} />
            <Typography variant="caption" color="error">{errors.SOI_VEREDA?.message}</Typography>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller name="SOI_LATITUD" control={control} render={({ field }) => (
            <TextField {...field}
              label="Latitud"
              type="number"
              fullWidth
              error={!!errors.SOI_LATITUD}
              helperText={errors.SOI_LATITUD?.message}
              InputProps={{ readOnly: true, }} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller name="SOI_LONGITUD" control={control} render={({ field }) => (
            <TextField {...field}
              label="Longitud"
              type="number"
              fullWidth
              error={!!errors.SOI_LONGITUD}
              helperText={errors.SOI_LONGITUD?.message}
              InputProps={{ readOnly: true, }} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <FormControl fullWidth error={!!errors.SOI_LOCALIDAD_ID}>
            <InputLabel id="localidad-label">Localidad</InputLabel>
            <Controller name="SOI_LOCALIDAD_ID" control={control} render={({ field }) => (
              <Select {...field} labelId="localidad-label" label="Localidad">
                {(localidades || []).map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>{loc.nombre}</MenuItem>
                ))}
              </Select>
            )} />
            <Typography variant="caption" color="error">{errors.SOI_LOCALIDAD_ID?.message}</Typography>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.SOI_ADJUNTO}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Adjuntar Archivo (PDF, JPG, PNG) Tamaño máximo 5MB.
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