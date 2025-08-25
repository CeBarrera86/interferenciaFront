import React, { useCallback, useEffect } from 'react';
import { Box, Typography, Grid, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Controller } from 'react-hook-form';
import { interferenciasSchema } from '../../validation/interferenciasSchema';

// Definiciones de empresas
const todasEmpresas = { descripcion: 'Todos los Servicios', id: 1 };
const tiposEmpresas = [
  { descripcion: 'Electricidad', id: 3 },
  { descripcion: 'Agua Potable y Saneamiento Urbano', id: 2 },
  { descripcion: 'Telefonía, Internet y TV', id: 6 },
];

/**
 * Componente que gestiona el grupo de checkboxes para los tipos de empresa.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.field - Objeto de campo de react-hook-form.
 * @param {object} props.errors - Objeto de errores del formulario.
 */
const CheckboxGroup = ({ field, errors }) => {
  const { onChange, value = [] } = field;

  const handleChange = useCallback((event) => {
    const clickedId = Number(event.target.value);
    let newValues;

    if (clickedId === todasEmpresas.id) {
      newValues = event.target.checked ? [todasEmpresas.id] : [];
    } else {
      const isChecked = event.target.checked;
      const filteredValues = value.filter(v => v !== todasEmpresas.id);

      if (isChecked) {
        newValues = [...filteredValues, clickedId];
      } else {
        newValues = filteredValues.filter((v) => v !== clickedId);
      }

      const allIndividualServices = tiposEmpresas.map(opcion => opcion.id);
      const allSelected = allIndividualServices.every(id => newValues.includes(id));

      if (allSelected) {
        newValues = [todasEmpresas.id];
      }
    }

    onChange(newValues);
  }, [onChange, value]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={value.includes(todasEmpresas.id)} onChange={handleChange} value={todasEmpresas.id} />}
            label={todasEmpresas.descripcion}
          />
        </FormGroup>
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <FormGroup>
          {tiposEmpresas.map((opcion) => (
            <FormControlLabel
              key={opcion.id}
              control={
                <Checkbox
                  checked={value.includes(opcion.id)}
                  onChange={handleChange}
                  value={opcion.id}
                  disabled={value.includes(todasEmpresas.id)}
                />
              }
              label={opcion.descripcion}
            />
          ))}
        </FormGroup>
      </Grid>
      {
        !!errors.SOI_EMPRESA && (
          <Typography variant="caption" color="error" sx={{ pl: 2 }}> {errors.SOI_EMPRESA.message} </Typography>
        )
      }
    </Grid >
  );
};

export default function FormEmpresas({ control, errors }) {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Servicios Involucrados
      </Typography>
      <Controller
        name="SOI_EMPRESA"
        control={control}
        defaultValue={[todasEmpresas.id]}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.SOI_EMPRESA} fullWidth>
            <CheckboxGroup field={field} errors={errors} />
          </FormControl>
        )}
      />
    </Box>
  );
}
