import React from 'react';
import {
  Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormLabel, RadioGroup, FormControlLabel, Radio, IconButton
} from '@mui/material';
import { Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function FormUbicacion({ control, errors, localidades, ubicaciones, onAddUbicacion, onRemoveUbicacion }) {
  return (
    <>
      {ubicaciones.map((_, index) => {
        const name = `SOI_UBICACIONES.${index}`;
        const showRemove = ubicaciones.length > 1;

        return (
          <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
            <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
              Ubicación {index + 1}
            </Typography>
            <Grid container spacing={2}>

              <Grid size={{ xs: 2, md: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={onAddUbicacion} sx={{ ml: 1 }}>
                    <AddIcon />
                  </IconButton>
                  {showRemove && (
                    <IconButton onClick={() => onRemoveUbicacion(index)} sx={{ ml: 1 }}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 10, md: 5 }}>
                <Controller
                  name={`${name}.USI_CALLE`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Calle" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_CALLE}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_CALLE?.message} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 4, md: 2 }}>
                <Controller
                  name={`${name}.USI_ALTURA`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Altura" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_ALTURA}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_ALTURA?.message}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 4, md: 2 }}>
                <Controller
                  name={`${name}.USI_PISO`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Piso" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_PISO}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_PISO?.message} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 4, md: 2 }}>
                <Controller
                  name={`${name}.USI_DPTO`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Dpto" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_DPTO}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_DPTO?.message} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6, md: 4 }}>
                <Controller
                  name={`${name}.USI_ENTRE1`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Entre Calle 1" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE1}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE1?.message} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6, md: 4 }}>
                <Controller
                  name={`${name}.USI_ENTRE2`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Entre Calle 2" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE2}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_ENTRE2?.message} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl component="fieldset" error={!!errors?.SOI_UBICACIONES?.[index]?.USI_VEREDA} fullWidth>
                  <FormLabel component="legend">Vereda</FormLabel>
                  <Controller
                    name={`${name}.USI_VEREDA`}
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel value="P" control={<Radio />} label="Par" />
                        <FormControlLabel value="I" control={<Radio />} label="Impar" />
                      </RadioGroup>
                    )}
                  />
                  <Typography variant="caption" color="error">
                    {errors?.SOI_UBICACIONES?.[index]?.USI_VEREDA?.message}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 4, md: 4 }}>
                <Controller
                  name={`${name}.USI_LATITUD`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Latitud" type="number" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_LATITUD}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_LATITUD?.message}
                      InputProps={{ readOnly: true }} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 4, md: 4 }}>
                <Controller
                  name={`${name}.USI_LONGITUD`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Longitud" type="number" fullWidth
                      error={!!errors?.SOI_UBICACIONES?.[index]?.USI_LONGITUD}
                      helperText={errors?.SOI_UBICACIONES?.[index]?.USI_LONGITUD?.message}
                      InputProps={{ readOnly: true }} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 4, md: 4 }}>
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
            </Grid>
          </Box>
        );
      })}
    </>
  );
}