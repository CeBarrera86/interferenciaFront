import { Box, Typography, Grid, TextField } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function FormObra({ control, errors }) {
  const fechaInicio = useWatch({ control, name: 'SOI_DESDE' });
  const minFechaFin = fechaInicio ? dayjs(fechaInicio) : dayjs();

  const containerStyles = {
    border: '1px solid #ccc',
    borderRadius: 2,
    p: 2,
    mb: 2,
    mt: 2,
    position: 'relative',
  };

  const labelStyles = {
    position: 'absolute',
    top: -12,
    left: 12,
    bgcolor: 'background.paper',
    px: 1,
  };

  return (
    <Box sx={containerStyles}>
      <Typography variant="subtitle1" sx={labelStyles}>
        Datos Obra
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller
            name="SOI_DESDE"
            control={control}
            render={({ field }) => (
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
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 6 }}>
          <Controller
            name="SOI_HASTA"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Fecha Fin"
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.toDate() || null)}
                minDate={minFechaFin}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.SOI_HASTA,
                    helperText: errors.SOI_HASTA?.message,
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="SOI_PROYECTO"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre del proyecto (Opcional)"
                fullWidth
                error={!!errors.SOI_PROYECTO}
                helperText={errors.SOI_PROYECTO?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="SOI_DESCRIPCION"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Breve descripción del proyecto (Opcional)"
                multiline
                rows={3}
                fullWidth
                error={!!errors.SOI_DESCRIPCION}
                helperText={errors.SOI_DESCRIPCION?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}