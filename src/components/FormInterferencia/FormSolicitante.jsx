import React from 'react';
import { Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormSolicitante({ control, errors }) {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Datos Solicitante
      </Typography>
      <Grid container direction="row" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "center", }}>
        {/* Fila 1: CUIT y Tipo de Persona */}
        <Grid size={{ xs: 4, md: 6 }}>
          <Controller name="DSI_CUIT" control={control} render={({ field }) => (
            <TextField {...field} label="CUIT" fullWidth error={!!errors.DSI_CUIT} helperText={errors.DSI_CUIT?.message} />
          )} />
        </Grid>
        <Grid size={{ xs: 8, md: 6 }}>
          <FormControl component="fieldset" error={!!errors.DSI_PERSONA} fullWidth>
            <FormLabel component="legend">Tipo de Persona</FormLabel>
            <Controller name="DSI_PERSONA" control={control} render={({ field }) => (
              <RadioGroup row value={field.value} onChange={field.onChange} >
                <FormControlLabel value="F" control={<Radio />} label="Física" />
                <FormControlLabel value="J" control={<Radio />} label="Jurídica" />
              </RadioGroup>)}
            />
            <Typography variant="caption" color="error"> {errors.DSI_PERSONA?.message} </Typography>
          </FormControl>
        </Grid>
        {/* Fila 2: Nombre y Apellido */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="DSI_NOMBRE" control={control} render={({ field }) => (
            <TextField {...field}
              label="Nombre"
              type='text'
              fullWidth
              error={!!errors.DSI_NOMBRE}
              helperText={errors.DSI_NOMBRE?.message} />
          )}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="DSI_APELLIDO" control={control} render={({ field }) => (
            <TextField {...field}
              label="Apellido"
              type='text'
              fullWidth
              error={!!errors.DSI_APELLIDO}
              helperText={errors.DSI_APELLIDO?.message} />
          )} />
        </Grid>
        {/* Fila 3: Email */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Controller name="DSI_EMAIL" control={control} render={({ field }) => (
            <TextField {...field}
              label="Email"
              type="email"
              fullWidth
              error={!!errors.DSI_EMAIL}
              helperText={errors.DSI_EMAIL?.message} />
          )} />
        </Grid>
      </Grid>
    </Box>
  );
}