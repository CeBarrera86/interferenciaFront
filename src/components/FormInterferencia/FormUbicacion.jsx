import React from 'react';
import { Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormUbicacion({ control, errors, localidades }) {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
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
      </Grid>
    </Box >
  );
}