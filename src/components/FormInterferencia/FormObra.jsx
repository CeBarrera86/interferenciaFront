import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function FormObra({ control, errors }) {
  const fechaInicio = useWatch({ control, name: 'SOI_DESDE' });
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Datos Obra
      </Typography>
      <Grid container direction="row" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "center", }}>
        {/* Fila 1: Fechas */}
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="SOI_DESDE" control={control} render={({ field }) => (
            <DatePicker
              label="Fecha Inicio"
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.toDate() || null)}
              disablePast
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.SOI_DESDE,
                  helperText: errors.SOI_DESDE?.message,
                },
              }}
            />)}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="SOI_HASTA" control={control} render={({ field }) => (
            <DatePicker
              label="Fecha Fin"
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.toDate() || null)}
              minDate={fechaInicio ? dayjs(fechaInicio) : dayjs()}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.SOI_HASTA,
                  helperText: errors.SOI_HASTA?.message,
                },
              }}
            />)}
          />
        </Grid>

        {/* Fila 2: Nombre Proyecto */}
        <Grid size={{ xs: 12 }}>
          <Controller name="SOI_PROYECTO" control={control} render={({ field }) => (
            <TextField {...field} label="Nombre del proyecto (Opcional)" fullWidth error={!!errors.SOI_PROYECTO} helperText={errors.SOI_PROYECTO?.message} />
          )} />
        </Grid>
        {/* Fila 3: Descripción Proyecto */}
        <Grid size={{ xs: 12 }}>
          <Controller name="SOI_DESCRIPCION" control={control} render={({ field }) => (
            <TextField
              {...field}
              label="Breve descripción del proyecto (Opcional)"
              multiline
              rows={3}
              fullWidth
              error={!!errors.SOI_DESCRIPCION}
              helperText={errors.SOI_DESCRIPCION?.message}
            />
          )} />
        </Grid>
      </Grid>
    </Box>
  );
}