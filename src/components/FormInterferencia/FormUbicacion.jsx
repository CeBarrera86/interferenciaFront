import React from 'react';
import {
  Box, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormLabel, RadioGroup, FormControlLabel, Radio, Tooltip, IconButton,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function FormUbicacion({
  control, errors, localidades, index, totalForms,
  remove, append, isRemovable, isLast,
}) {
  const ubicacionName = `SOI_UBICACIONES.${index}`;

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        {totalForms > 1 ? `Ubicación Interferencia #${index + 1}` : 'Ubicación Interferencia'}
      </Typography>
      <Grid container direction="row" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "center", }}>
        <Grid size={{ xs: 6, md: 5 }}>
          <Controller
            name={`${ubicacionName}.USI_CALLE`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Calle"
                type='text'
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_CALLE}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_CALLE?.message} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller
            name={`${ubicacionName}.USI_ALTURA`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Altura"
                type="text"
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_ALTURA}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_ALTURA?.message}
                // Convertir a número antes de que react-hook-form lo guarde
                onChange={(e) => field.onChange(parseFloat(e.target.value))} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller
            name={`${ubicacionName}.USI_PISO`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Piso"
                type='text'
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_PISO}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_PISO?.message} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Controller
            name={`${ubicacionName}.USI_DPTO`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Dpto"
                type='text'
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_DPTO}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_DPTO?.message} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 1 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isLast && (
            <Tooltip title="Agregar Ubicación">
              <IconButton onClick={() => append()} size="small">
                <AddIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
          {isRemovable && isLast && (
            <Tooltip title="Quitar Ubicación">
              <IconButton onClick={() => remove(index)} color="error" size="small">
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller
            name={`${ubicacionName}.USI_ENTRE1`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Entre Calle 1"
                type='text'
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_ENTRE1}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_ENTRE1?.message} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller
            name={`${ubicacionName}.USI_ENTRE2`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Entre Calle 2"
                type='text'
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_ENTRE2}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_ENTRE2?.message} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <FormControl component="fieldset" error={!!errors.SOI_UBICACIONES?.[index]?.USI_VEREDA} fullWidth>
            <FormLabel component="legend">Vereda</FormLabel>
            <Controller
              name={`${ubicacionName}.USI_VEREDA`}
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel value="P" control={<Radio />} label="Par" />
                  <FormControlLabel value="I" control={<Radio />} label="Impar" />
                </RadioGroup>
              )} />
            <Typography variant="caption" color="error">{errors.SOI_UBICACIONES?.[index]?.USI_VEREDA?.message}</Typography>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller
            name={`${ubicacionName}.USI_LATITUD`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Latitud"
                type="number"
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_LATITUD}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_LATITUD?.message}
                InputProps={{ readOnly: true, }} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Controller
            name={`${ubicacionName}.USI_LONGITUD`}
            control={control}
            render={({ field }) => (
              <TextField {...field}
                label="Longitud"
                type="number"
                fullWidth
                error={!!errors.SOI_UBICACIONES?.[index]?.USI_LONGITUD}
                helperText={errors.SOI_UBICACIONES?.[index]?.USI_LONGITUD?.message}
                InputProps={{ readOnly: true, }} />
            )} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <FormControl fullWidth error={!!errors.SOI_UBICACIONES?.[index]?.USI_LOCALIDAD_ID}>
            <InputLabel id={`localidad-label-${index}`}>Localidad</InputLabel>
            <Controller
              name={`${ubicacionName}.USI_LOCALIDAD_ID`}
              control={control}
              render={({ field }) => (
                <Select {...field} labelId={`localidad-label-${index}`} label="Localidad">
                  {(localidades || []).map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>{loc.nombre}</MenuItem>
                  ))}
                </Select>
              )} />
            <Typography variant="caption" color="error">{errors.SOI_UBICACIONES?.[index]?.USI_LOCALIDAD_ID?.message}</Typography>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
