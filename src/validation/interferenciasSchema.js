import * as yup from 'yup';

const ubicacionSchema = yup.object().shape({
  USI_CALLE: yup.string().required('La calle es requerida'),
  USI_ALTURA: yup.string().required('La altura es requerida')
    .test(
      'is-valid-altura',
      'La altura debe ser un número válido',
      (value) => {
        return !isNaN(parseFloat(value));
      }
    ),
  USI_PISO: yup.string().notRequired(),
  USI_DPTO: yup.string().notRequired(),
  USI_VEREDA: yup.string().required('La vereda es requerida'),
  USI_ENTRE1: yup.string().notRequired(),
  USI_ENTRE2: yup.string().notRequired(),
  USI_LOCALIDAD_ID: yup.string().required('La localidad es requerida'),
  USI_LATITUD: yup.number().nullable().required('La latitud es requerida'),
  USI_LONGITUD: yup.number().nullable().required('La longitud es requerida'),
});

export const interferenciasSchema = yup.object().shape({
  DSI_CUIT: yup.string().required('El CUIT es requerido'),
  DSI_NOMBRE: yup.string().required('El nombre es requerido'),
  DSI_APELLIDO: yup.string().required('El apellido es requerido'),
  DSI_PERSONA: yup.string().required('El tipo de persona es requerido'),
  DSI_EMAIL: yup.string().email('El formato del email no es válido').required('El email es requerido'),
  SOI_PROYECTO: yup.string().required('El nombre del proyecto es requerido'),
  SOI_DESCRIPCION: yup.string().required('La descripción del proyecto es requerida'),
  SOI_DESDE: yup.string().required('La fecha de inicio es requerida'),
  SOI_HASTA: yup.string().required('La fecha de fin es requerida'),
  SOI_UBICACIONES: yup.array().of(ubicacionSchema).min(1, 'Debe agregar al menos una ubicación de interferencia.').required(),
  SOI_EMPRESA: yup.array().min(1, 'Debe seleccionar al menos un tipo de empresa afectado.').required(),
  SOI_DOCUMENTO: yup.mixed().nullable().notRequired(),
  SOI_MAPA: yup.mixed().nullable().notRequired(),

  // Al menos uno de los se adjunta.
  adjuntos: yup.mixed().test(
    'at-least-one-adjunto',
    'Debe adjuntar un archivo o una captura de mapa',
    function (value) {
      const { SOI_DOCUMENTO, SOI_MAPA } = this.parent;
      return !!SOI_DOCUMENTO || !!SOI_MAPA;
    }
  ),
});
