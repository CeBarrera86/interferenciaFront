import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Controller } from 'react-hook-form';

// Definiciones de empresas
const todasEmpresas = { descripcion: 'Todos los Servicios', id: 1 };
const tiposEmpresas = [
  { descripcion: 'Electricidad', id: 3 },
  { descripcion: 'Agua Potable y Saneamiento Urbano', id: 2 },
  { descripcion: 'Telefonía, Internet y TV', id: 6 },
];

const calcularNuevaSeleccion = (clickedId, isChecked, currentValues, allIds) => {
  if (clickedId === todasEmpresas.id) {
    return isChecked ? [todasEmpresas.id] : [];
  }

  const filtered = currentValues.filter((v) => v !== todasEmpresas.id);
  const updated = isChecked ? [...filtered, clickedId] : filtered.filter((v) => v !== clickedId);

  const allSelected = allIds.every((id) => updated.includes(id));
  return allSelected ? [todasEmpresas.id] : updated;
};

const CheckboxGroup = ({ field, errors }) => {
  const { onChange, value = [] } = field;
  const allIndividualIds = useMemo(() => tiposEmpresas.map((e) => e.id), []);

  const handleChange = useCallback(
    (event) => {
      const clickedId = Number(event.target.value);
      const isChecked = event.target.checked;
      const newValues = calcularNuevaSeleccion(clickedId, isChecked, value, allIndividualIds);
      onChange(newValues);
    },
    [onChange, value, allIndividualIds]
  );

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={value.includes(todasEmpresas.id)}
                onChange={handleChange}
                value={todasEmpresas.id}
              />
            }
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
      {!!errors.SOI_EMPRESA && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="error" sx={{ pl: 2 }}>
            {errors.SOI_EMPRESA.message}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default function FormEmpresas({ control, errors }) {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        p: 2,
        mb: 2,
        mt: 2,
        position: 'relative',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          position: 'absolute',
          top: -12,
          left: 12,
          bgcolor: 'background.paper',
          px: 1,
        }}
      >
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