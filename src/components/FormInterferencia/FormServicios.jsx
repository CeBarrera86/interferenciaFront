import React, { useCallback } from 'react';
import { Box, Typography, Grid, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Controller } from 'react-hook-form';

const serviciosTodos = { descripcion: 'Todos los Servicios', id: 1 };
const serviciosOpciones = [
  { descripcion: 'Electricidad', id: 3 },
  { descripcion: 'Agua Potable y Saneamiento Urbano', id: 2 },
  { descripcion: 'Telefonía, Internet y TV', id: 6 },
];

const CheckboxGroup = ({ field, errors }) => {
  const { onChange, value = [] } = field;

  const handleChange = useCallback((event) => {
    const clickedId = Number(event.target.value);
    let newValues;

    if (clickedId === serviciosTodos.id) {
      newValues = event.target.checked ? [serviciosTodos.id] : [];
    } else {
      if (event.target.checked) {
        newValues = value.filter(v => v !== serviciosTodos.id);
        newValues = [...newValues, clickedId];
      } else {
        newValues = value.filter((v) => v !== clickedId);
      }

      const allIndividualServices = serviciosOpciones.map(opcion => opcion.id);
      const allSelected = allIndividualServices.every(id => newValues.includes(id));

      if (allSelected) {
        newValues = [serviciosTodos.id];
      }

      if (value.includes(serviciosTodos.id) && !event.target.checked) {
        newValues = allIndividualServices;
      }
    }
    onChange(newValues);
  }, [onChange, value]);

  return (
    <Grid container spacing={2}>
      {/* Columna Izquierda */}
      <Grid size={{ xs: 12, md: 5 }}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={value.includes(serviciosTodos.id)} onChange={handleChange} value={serviciosTodos.id} />}
            label={serviciosTodos.descripcion}
          />
        </FormGroup>
      </Grid>
      {/* Columna Derecha */}
      <Grid size={{ xs: 12, md: 7 }}>
        <FormGroup>
          {serviciosOpciones.map((opcion) => (
            <FormControlLabel
              key={opcion.id}
              control={
                <Checkbox checked={value.includes(opcion.id)} onChange={handleChange} value={opcion.id} disabled={value.includes(serviciosTodos.id)} />
              }
              label={opcion.descripcion}
            />
          ))}
        </FormGroup>
      </Grid>
      {!!errors.SOI_SERVICIO && (
        <Typography variant="caption" color="error" sx={{ pl: 2 }}> {errors.SOI_SERVICIO.message} </Typography>
      )}
    </Grid>
  );
};

export default function FormServicios({ control, errors }) {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Servicios Involucrados
      </Typography>
      <Controller
        name="SOI_SERVICIO"
        control={control}
        defaultValue={[serviciosTodos.id]}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.SOI_SERVICIO} fullWidth>
            <CheckboxGroup field={field} errors={errors} />
          </FormControl>
        )}
      />
    </Box>
  );
}