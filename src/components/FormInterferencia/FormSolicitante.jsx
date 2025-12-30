import {
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from '@mui/material';
import { Controller } from 'react-hook-form';

export default function FormSolicitante({ control, errors }) {
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
        Datos Solicitante
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid size={{ xs: 5, md: 6 }}>
          <Controller
            name="DSI_CUIT"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="CUIT"
                fullWidth
                error={!!errors.DSI_CUIT}
                helperText={errors.DSI_CUIT?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 7, md: 6 }}>
          <FormControl component="fieldset" error={!!errors.DSI_PERSONA} fullWidth>
            <FormLabel component="legend">Tipo de Persona</FormLabel>
            <Controller
              name="DSI_PERSONA"
              control={control}
              render={({ field }) => (
                <RadioGroup row value={field.value} onChange={field.onChange}>
                  <FormControlLabel value="F" control={<Radio />} label="Física" />
                  <FormControlLabel value="J" control={<Radio />} label="Jurídica" />
                </RadioGroup>
              )}
            />
            {!!errors.DSI_PERSONA && (
              <Typography variant="caption" color="error">
                {errors.DSI_PERSONA.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 6, md: 6 }}>
          <Controller
            name="DSI_NOMBRE"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
                fullWidth
                error={!!errors.DSI_NOMBRE}
                helperText={errors.DSI_NOMBRE?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 6 }}>
          <Controller
            name="DSI_APELLIDO"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Apellido"
                fullWidth
                error={!!errors.DSI_APELLIDO}
                helperText={errors.DSI_APELLIDO?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="DSI_EMAIL"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.DSI_EMAIL}
                helperText={errors.DSI_EMAIL?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}