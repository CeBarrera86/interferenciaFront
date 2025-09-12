import * as yup from 'yup';

const ubicacionSchema = yup.object().shape({
  USI_CALLE: yup.string().required('Campo requerido'),
  USI_ALTURA: yup.string().required('Campo requerido')
    .test('is-valid-altura', 'La altura debe ser un número válido',
      (value) => { return !isNaN(parseFloat(value)); }),
  USI_PISO: yup.string().notRequired(),
  USI_DPTO: yup.string().notRequired(),
  USI_VEREDA: yup.string().required(),
  USI_ENTRE1: yup.string().notRequired(),
  USI_ENTRE2: yup.string().notRequired(),
  USI_LOCALIDAD_ID: yup.string().required('Campo requerido'),
  USI_LATITUD: yup.number().nullable().required(),
  USI_LONGITUD: yup.number().nullable().required(),
});

export const interferenciasSchema = yup.object().shape({
  DSI_CUIT: yup.string().required('Campo requerido'),
  DSI_NOMBRE: yup.string().required('Campo requerido'),
  DSI_APELLIDO: yup.string().required('Campo requerido'),
  DSI_PERSONA: yup.string().required('Campo requerido'),
  DSI_EMAIL: yup.string().email('Formato de email no válido').required('Campo requerido'),
  SOI_PROYECTO: yup.string().trim().notRequired(),
  SOI_DESCRIPCION: yup.string().trim().notRequired(),
  SOI_DESDE: yup.date().nullable().required('Campo requerido')
    .min(new Date(), 'La fecha de inicio debe ser posterior a la fecha actual'),
  SOI_HASTA: yup.date().nullable().required('Campo requerido')
    .test('fecha-fin-posterior', 'La fecha de fin debe ser posterior a la fecha de inicio',
      function (hasta) { const desde = this.parent.SOI_DESDE; return !desde || !hasta || hasta > desde; }),
  SOI_UBICACIONES: yup.array().of(ubicacionSchema).min(1).required(),
  SOI_EMPRESA: yup.array().min(1).required(),
  SOI_DOCUMENTOS: yup.array().of(yup.mixed()).notRequired(),
  SOI_MAPA: yup.mixed().nullable().notRequired(),

  // Al menos uno de los se adjunta.
  adjuntos: yup.mixed().test('at-least-one-adjunto', 'Debe adjuntar un archivo o una captura de mapa',
    function (value) { const { SOI_DOCUMENTO, SOI_MAPA } = this.parent; return !!SOI_DOCUMENTO || !!SOI_MAPA; }),
});
