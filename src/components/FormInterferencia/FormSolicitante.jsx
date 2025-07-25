import React from 'react';
import { Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormSolicitante({ control, errors }) {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 4, mt: 3, position: 'relative', pt: 4 }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Datos Solicitante
      </Typography>
      <Grid container direction="row" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "center", }}>
        {/* Fila 1: CUIT y Tipo de Persona */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="SOI_CUIT" control={control} render={({ field }) => (
            <TextField {...field} label="CUIT" fullWidth error={!!errors.SOI_CUIT} helperText={errors.SOI_CUIT?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <FormControl component="fieldset" error={!!errors.SOI_PERSONA} fullWidth>
            <FormLabel component="legend">Tipo de Persona</FormLabel>
            <Controller name="SOI_PERSONA" control={control} render={({ field }) => (
              <RadioGroup {...field} row >
                <FormControlLabel value="F" control={<Radio />} label="Física" />
                <FormControlLabel value="J" control={<Radio />} label="Jurídica" />
              </RadioGroup>
            )}
            />
            <Typography variant="caption" color="error"> {errors.SOI_PERSONA?.message} </Typography>
          </FormControl>
        </Grid>
        {/* Fila 2: Nombre y Apellido */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="SOI_NOMBRE" control={control} render={({ field }) => (
            <TextField {...field}
              label="Nombre"
              type='text'
              fullWidth
              error={!!errors.SOI_NOMBRE}
              helperText={errors.SOI_NOMBRE?.message} />
          )}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="SOI_APELLIDO" control={control} render={({ field }) => (
            <TextField {...field}
              label="Apellido"
              type='text'
              fullWidth
              error={!!errors.SOI_APELLIDO}
              helperText={errors.SOI_APELLIDO?.message} />
          )} />
        </Grid>
        {/* Fila 3: Email */}
        <Grid size={{ xs: 6, md: 12 }}>
          <Controller name="SOI_EMAIL" control={control} render={({ field }) => (
            <TextField {...field}
              label="Email"
              type="email"
              fullWidth
              error={!!errors.SOI_EMAIL}
              helperText={errors.SOI_EMAIL?.message} />
          )} />
        </Grid>
      </Grid>
    </Box>
  );
}