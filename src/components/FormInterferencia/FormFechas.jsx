import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FormFechas({ control, errors }) {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, position: 'relative', pt: 4 }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Fecha de Obra
      </Typography>
      <Grid container direction="row" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "center", }}>
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="SOI_DESDE" control={control} render={({ field }) => (
            <DatePicker {...field}
              label="Desde"
              type="date"
              fullWidth
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.SOI_DESDE,
                  helperText: errors.SOI_DESDE?.message,
                },
              }} />
          )} />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Controller name="SOI_HASTA" control={control} render={({ field }) => (
            <DatePicker {...field}
              label="Hasta"
              type="date"
              fullWidth
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.SOI_HASTA,
                  helperText: errors.SOI_HASTA?.message,
                },
              }} />
          )} />
        </Grid>
      </Grid>
    </Box>
  );
}