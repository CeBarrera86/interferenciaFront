export const posicionInicial = {
  lat: -35.65867,
  lng: -63.75715,
};

export const ubicacionBase = {
  USI_CALLE: '',
  USI_ALTURA: '',
  USI_PISO: '',
  USI_DPTO: '',
  USI_VEREDA: 'P',
  USI_ENTRE1: '',
  USI_ENTRE2: '',
  USI_LOCALIDAD_ID: '',
  USI_LATITUD: posicionInicial.lat,
  USI_LONGITUD: posicionInicial.lng,
};

export const formularioInicial = {
  DSI_CUIT: '',
  DSI_PERSONA: 'F',
  DSI_NOMBRE: '',
  DSI_APELLIDO: '',
  DSI_EMAIL: '',
  SOI_EMPRESA: [1],
  SOI_PROYECTO: '',
  SOI_DESCRIPCION: '',
  SOI_DESDE: null,
  SOI_HASTA: null,
  SOI_DOCUMENTO: [],
  SOI_MAPA: null,
  SOI_UBICACIONES: [ubicacionBase],
};
