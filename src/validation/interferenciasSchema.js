import * as yup from 'yup';

// Esquema para una única ubicación dentro del array
const ubicacionSchema = yup.object().shape({
  SOI_CALLE: yup.string()
    .required('La calle es requerida')
    .max(50, 'Calle no debe exceder los 50 caracteres'),
  SOI_ALTURA: yup.string()
    .required('La altura es requerida')
    .max(10, 'Altura no debe exceder los 10 caracteres'),
  SOI_PISO: yup.string()
    .max(10, 'Piso no debe exceder los 10 caracteres')
    .nullable(),
  SOI_DPTO: yup.string()
    .max(10, 'Dpto no debe exceder los 10 caracteres')
    .nullable(),
  SOI_ENTRE1: yup.string()
    .max(50, 'Entre Calle 1 no debe exceder los 50 caracteres')
    .nullable(),
  SOI_ENTRE2: yup.string()
    .max(50, 'Entre Calle 2 no debe exceder los 50 caracteres')
    .nullable(),
  SOI_VEREDA: yup.string()
    .required('La vereda es requerida')
    .oneOf(['P', 'I'], 'Vereda debe ser "P" (Par) o "I" (Impar)'),
  SOI_LATITUD: yup.number()
    .required('Latitud es requerida')
    .typeError('Latitud debe ser un número'),
  SOI_LONGITUD: yup.number()
    .required('Longitud es requerida')
    .typeError('Longitud debe ser un número'),
  SOI_LOCALIDAD_ID: yup.number()
    .integer('Localidad debe ser un número entero')
    .min(1, 'Localidad es requerida')
    .required('Localidad es requerida')
    .typeError('Localidad es requerida'),
});

export const interferenciasSchema = yup.object().shape({
  SOI_CUIT: yup.string()
    .required('CUIT es requerido')
    .max(20, 'CUIT no debe exceder los 20 caracteres'),
  SOI_NOMBRE: yup.string()
    .required('Nombre es requerido')
    .max(50, 'Nombre no debe exceder los 50 caracteres'),
  SOI_APELLIDO: yup.string()
    .required('Apellido es requerido')
    .max(50, 'Apellido no debe exceder los 50 caracteres'),
  SOI_PERSONA: yup.string()
    .required('Tipo de persona es requerido')
    .oneOf(['F', 'J'], 'Tipo de persona debe ser "F" (Física) o "J" (Jurídica)'),
  SOI_EMAIL: yup.string()
    .email('Email inválido')
    .required('Email es requerido')
    .max(50, 'Email no debe exceder los 50 caracteres'),
  SOI_DESDE: yup.date()
    .required('Fecha desde es requerida')
    .typeError('Fecha inválida'),
  SOI_HASTA: yup.date()
    .required('Fecha hasta es requerida')
    .typeError('Fecha inválida')
    .min(yup.ref('SOI_DESDE'), 'La fecha hasta no puede ser anterior a la fecha desde'),
  SOI_SERVICIO: yup.array()
    .of(yup.number())
    .min(1, 'Debe seleccionar al menos un servicio.')
    .required('Debe seleccionar al menos un servicio.')
    .typeError('Debe seleccionar al menos un servicio.'),
  SOI_ADJUNTO: yup.mixed()
    .required('Debe adjuntar un archivo o tomar una captura del mapa.')
    .nullable()
    .test(
      'file-or-map-present',
      'Debe adjuntar un archivo o tomar una captura del mapa.',
      (value) => {
        return value instanceof File;
      }
    ),
  // VALIDACIÓN AGREGADA
  SOI_UBICACIONES: yup.array()
    .of(ubicacionSchema)
    .min(1, 'Debe haber al menos una ubicación.')
    .required('Debe haber al menos una ubicación.'),
});
