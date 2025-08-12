import React, { useCallback, useEffect } from 'react';
import { Box, Typography, Grid, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Controller } from 'react-hook-form';
import { interferenciasSchema } from '../../validation/interferenciasSchema'; // Asegúrate de que esta sea la ruta correcta

// Definiciones de servicios
const serviciosTodos = { descripcion: 'Todos los Servicios', id: 1 };
const serviciosOpciones = [
  { descripcion: 'Electricidad', id: 3 },
  { descripcion: 'Agua Potable y Saneamiento Urbano', id: 2 },
  { descripcion: 'Telefonía, Internet y TV', id: 6 },
];

/**
 * Componente que gestiona el grupo de checkboxes para los servicios.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.field - Objeto de campo de react-hook-form.
 * @param {object} props.errors - Objeto de errores del formulario.
 */
const CheckboxGroup = ({ field, errors }) => {
  const { onChange, value = [] } = field;

  const handleChange = useCallback((event) => {
    const clickedId = Number(event.target.value);
    let newValues;

    if (clickedId === serviciosTodos.id) {
      newValues = event.target.checked ? [serviciosTodos.id] : [];
    } else {
      const isChecked = event.target.checked;
      const filteredValues = value.filter(v => v !== serviciosTodos.id);

      if (isChecked) {
        newValues = [...filteredValues, clickedId];
      } else {
        newValues = filteredValues.filter((v) => v !== clickedId);
      }

      const allIndividualServices = serviciosOpciones.map(opcion => opcion.id);
      const allSelected = allIndividualServices.every(id => newValues.includes(id));

      if (allSelected) {
        newValues = [serviciosTodos.id];
      }
    }

    onChange(newValues);
  }, [onChange, value]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={value.includes(serviciosTodos.id)} onChange={handleChange} value={serviciosTodos.id} />}
            label={serviciosTodos.descripcion}
          />
        </FormGroup>
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <FormGroup>
          {serviciosOpciones.map((opcion) => (
            <FormControlLabel
              key={opcion.id}
              control={
                <Checkbox
                  checked={value.includes(opcion.id)}
                  onChange={handleChange}
                  value={opcion.id}
                  disabled={value.includes(serviciosTodos.id)}
                />
              }
              label={opcion.descripcion}
            />
          ))}
        </FormGroup>
      </Grid>
      {
        !!errors.SOI_SERVICIO && (
          <Typography variant="caption" color="error" sx={{ pl: 2 }}> {errors.SOI_SERVICIO.message} </Typography>
        )
      }
    </Grid >
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
