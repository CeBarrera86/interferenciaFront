import React from 'react';
import {
  Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Tooltip
} from '@mui/material';
import { Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function FormUbicacion({
  control,
  errors,
  localidades,
  ubicaciones,
  onAddUbicacion,
  onRemoveUbicacion,
  onAddressChange
}) {
  return (
    <>
      {ubicaciones.map((_, index) => {
        const name = `SOI_UBICACIONES.${index}`;

        return (
          <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
            <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
              {ubicaciones.length === 1 ? 'Ubicación' : `Ubicación ${index + 1}`}
            </Typography>
            <Grid container spacing={2}>

              {/* Campo Localidad */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth error={!!errors?.SOI_UBICACIONES?.[index]?.USI_LOCALIDAD_ID}>
                  <InputLabel id={`localidad-label-${index}`}>Localidad</InputLabel>
                  <Controller
                    name={`${name}.USI_LOCALIDAD_ID`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field} labelId={`localidad-label-${index}`} label="Localidad">
                        {(localidades || []).map((loc) => (
                          <MenuItem key={loc.id} value={loc.id}>{loc.nombre}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.SOI_UBICACIONES?.[index]?.USI_LOCALIDAD_ID?.message}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Campos LATITUD y LONGITUD (Solo lectura, manejados por el mapa) */}
              <Grid size={{ xs: 6, md: 4 }}>
                <Controller
                  name={`${name}.USI_LATITUD`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Latitud" type="number" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_LATITUD}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_LATITUD?.message}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6, md: 4 }}>
                <Controller
                  name={`${name}.USI_LONGITUD`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Longitud" type="number" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_LONGITUD}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_LONGITUD?.message}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                />
              </Grid>

              {/* Campo CALLE */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name={`${name}.USI_CALLE`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Calle" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_CALLE}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_CALLE?.message}
                      // 🔴 CAMBIO CLAVE PUNTO 2: Al perder el foco, intenta geocodificar
                      onBlur={(e) => {
                        field.onBlur(e);
                        onAddressChange(index);
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Campo ALTURA */}
              <Grid size={{ xs: 4, md: 2 }}>
                <Controller
                  name={`${name}.USI_ALTURA`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Altura" type="number" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_ALTURA}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_ALTURA?.message}
                      // 🔴 CAMBIO CLAVE PUNTO 2: Al perder el foco, intenta geocodificar
                      onBlur={(e) => {
                        field.onBlur(e);
                        onAddressChange(index);
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Campo PISO */}
              <Grid size={{ xs: 4, md: 2 }}>
                <Controller
                  name={`${name}.USI_PISO`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Piso" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_PISO}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_PISO?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campo DPTO */}
              <Grid size={{ xs: 4, md: 2 }}>
                <Controller
                  name={`${name}.USI_DPTO`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Dpto" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_DPTO}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_DPTO?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campos Entre Calles */}
              <Grid size={{ xs: 6, md: 3.5 }}>
                <Controller
                  name={`${name}.USI_ENTRE1`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Entre Calle 1" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE1}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE1?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Controller
                  name={`${name}.USI_ENTRE2`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Entre Calle 2" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE2}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE2?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campo Vereda */}
              <Grid size={{ xs: 10, md: 4 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: 'text.secondary' }}>Vereda</FormLabel>
                  <Controller
                    name={`${name}.USI_VEREDA`}
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel value="P" control={<Radio size="small" />} label="Par" />
                        <FormControlLabel value="I" control={<Radio size="small" />} label="Impar" />
                      </RadioGroup>
                    )}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.SOI_UBICACIONES?.[index]?.USI_VEREDA?.message}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Botones de Agregar/Eliminar */}
              <Grid size={{ xs: 2, md: 1 }} sx={{ alignSelf: 'flex-end', p: 0 }}>
                {(ubicaciones.length === 1 || index === ubicaciones.length - 1) && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      height: '100%',
                      pt: ubicaciones.length === 1 ? '16px' : 0
                    }}
                  >
                    <Tooltip title="Agregar Ubicación">
                      <IconButton color="primary" onClick={onAddUbicacion} disabled={ubicaciones.length >= 5} >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {ubicaciones.length > 1 && (
                      <Tooltip title="Eliminar Ubicación">
                        <IconButton color="error" onClick={() => onRemoveUbicacion(index)}>
                          <RemoveIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )}
              </Grid>

            </Grid>
          </Box >
        );
      })}
    </>
  );
}