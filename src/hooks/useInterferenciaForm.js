import { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { interferenciasSchema } from '../validation/interferenciasSchema';

// Definir los valores por defecto para una nueva ubicación
const defaultUbicacion = {
  USI_CALLE: '',
  USI_ALTURA: '',
  USI_PISO: '',
  USI_DPTO: '',
  USI_VEREDA: 'P',
  USI_ENTRE1: '',
  USI_ENTRE2: '',
  USI_LOCALIDAD_ID: '',
  USI_LATITUD: -35.65867,
  USI_LONGITUD: -63.75715,
};

// Se han movido los valores por defecto aquí para evitar la dependencia de un archivo externo.
const formDefaultValues = {
  DSI_CUIT: '',
  DSI_NOMBRE: '',
  DSI_APELLIDO: '',
  DSI_PERSONA: 'F',
  DSI_EMAIL: '',
  SOI_PROYECTO: '',
  SOI_DESCRIPCION: '',
  SOI_DESDE: null,
  SOI_HASTA: null,
  SOI_DOCUMENTO: null,
  SOI_MAPA: null,
};

// Utilidad para validar si un punto está dentro de una forma
const esPuntoEnForma = (punto, forma) => {
  if (!window.google || !window.google.maps || !window.google.maps.geometry) {
    console.error("Google Maps API o la librería de Geometría no está cargada.");
    return false;
  }

  const latLng = new window.google.maps.LatLng(punto.lat, punto.lng);
  let isInside = false;

  if (forma.type === 'polygon') {
    const polygon = new window.google.maps.Polygon({ paths: forma.paths });
    isInside = window.google.maps.geometry.poly.containsLocation(latLng, polygon);
  } else if (forma.type === 'rectangle') {
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(forma.bounds.south, forma.bounds.west),
      new window.google.maps.LatLng(forma.bounds.north, forma.bounds.east)
    );
    isInside = bounds.contains(latLng);
  }

  return isInside;
};

export function useInterferenciaForm() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(interferenciasSchema),
    defaultValues: {
      ...formDefaultValues,
      SOI_UBICACIONES: [defaultUbicacion],
    },
  });

  const { fields: ubicaciones, append, remove } = useFieldArray({
    control,
    name: 'SOI_UBICACIONES',
  });

  const [abrirDialogoExito, setAbrirDialogoExito] = useState(false);
  const [abrirDialogoError, setAbrirDialogoError] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [detallesError, setDetallesError] = useState('');
  const [idInterferencia, setIdInterferencia] = useState(null);
  const [abrirVistaPreviaMapa, setAbrirVistaPreviaMapa] = useState(false);
  const [datosCapturaMapa, setDatosCapturaMapa] = useState(null);
  const [puedeCapturarMapa, setPuedeCapturarMapa] = useState(false);
  const [formasDibujadas, setFormasDibujadas] = useState([]);

  // Observa el estado del formulario
  const adjuntoMapa = watch('SOI_MAPA');
  const adjuntoDocumento = watch('SOI_DOCUMENTO');
  const latitudActual = watch('SOI_UBICACIONES.0.USI_LATITUD');
  const longitudActual = watch('SOI_UBICACIONES.0.USI_LONGITUD');

  // Captura del mapa
  const manejarCapturaMapa = useCallback(async (imageDataUrl) => {
    setDatosCapturaMapa(imageDataUrl);
    setAbrirVistaPreviaMapa(true);

    // Convertir dataURL en blob para que el backend lo reciba como archivo real
    const res = await fetch(imageDataUrl);
    const blob = await res.blob();
    const file = new File([blob], `mapa_${Date.now()}.png`, { type: 'image/png' });

    setValue('SOI_MAPA', file, { shouldDirty: true });
    // Importante: NO limpiar SOI_DOCUMENTO
  }, [setValue]);

  // Carga manual de archivo
  const manejarCambioArchivoUbicacion = useCallback((file) => {
    setValue('SOI_DOCUMENTO', file, { shouldDirty: true });
    // Importante: NO limpiar SOI_MAPA
  }, [setValue]);

  // Limpieza de ambos adjuntos (puedes crear limpiezas separadas si querés más control)
  const limpiarAdjunto = useCallback(() => {
    setValue('SOI_DOCUMENTO', null);
    setValue('SOI_MAPA', null);
    setDatosCapturaMapa(null);
    setFormasDibujadas([]);
  }, [setValue]);

  const manejarClickMapa = useCallback((lat, lng) => {
    setValue('SOI_UBICACIONES.0.USI_LATITUD', lat);
    setValue('SOI_UBICACIONES.0.USI_LONGITUD', lng);
  }, [setValue]);

  const cerrarVistaPreviaMapa = useCallback(() => {
    setAbrirVistaPreviaMapa(false);
  }, []);

  const enviarFormulario = useCallback(async (data) => {
    console.log('Datos a enviar (desde hook):', data);

    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === 'SOI_UBICACIONES' && Array.isArray(data[key])) {
          data[key].forEach((ubicacion, index) => {
            for (const ubiKey in ubicacion) {
              formData.append(`SOI_UBICACIONES[${index}][${ubiKey}]`, ubicacion[ubiKey]);
            }
          });
        } else if (data[key] instanceof File) {
          // Adjunta archivos
          formData.append(key, data[key], data[key].name);
        } else if (key === 'SOI_EMPRESA' && Array.isArray(data[key])) {
          formData.append(key, data[key].join(','));
        } else if (key === 'SOI_DESDE' || key === 'SOI_HASTA') {
          // Maneja las fechas específicamente, convirtiéndolas a YYYY-MM-DD
          let dateObject = data[key];
          if (typeof dateObject === 'string') {
            dateObject = new Date(dateObject);
          }
          const formattedDate = dateObject.getFullYear() + '-' +
            ('0' + (dateObject.getMonth() + 1)).slice(-2) + '-' +
            ('0' + dateObject.getDate()).slice(-2);
          formData.append(key, formattedDate);
        } else {
          // Adjunta todos los demás campos
          formData.append(key, data[key]);
        }
      }
    }

    // Debug
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await fetch('http://localhost:3000/api/interferencia/store', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al enviar el formulario:', response.status, errorData);

        setMensajeError(errorData.message || 'Error desconocido al procesar la solicitud.');
        setDetallesError(errorData.error || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || '');
        setAbrirDialogoError(true);
        return false;
      } else {
        const result = await response.json();
        console.log('Formulario enviado con éxito:', result);

        setMensajeExito(result.message);
        setIdInterferencia(result.id);
        setAbrirDialogoExito(true);
        return true;
      }
    } catch (error) {
      console.error('Error de red o en la petición:', error);
      setMensajeError('Error de conexión. No se pudo llegar al servidor.');
      setDetallesError(error.message);
      setAbrirDialogoError(true);
      return false;
    }
  }, []);

  const resetearFormularioYMapa = useCallback(() => {
    reset();
    setAbrirDialogoExito(false);
    setFormasDibujadas([]);
    limpiarAdjunto();
  }, [reset, limpiarAdjunto]);

  const cerrarDialogoError = useCallback(() => {
    setAbrirDialogoError(false);
  }, []);

  // Lógica para determinar si se puede capturar el mapa
  useEffect(() => {
    const hayUbicacion = latitudActual !== -35.65867 || longitudActual !== -63.75715;
    const hayFormas = formasDibujadas.length > 0;
    const posicionMarcador = { lat: latitudActual, lng: longitudActual };

    let permitirCaptura = false;

    if (hayUbicacion && !hayFormas) {
      permitirCaptura = true;
    } else if (hayUbicacion && hayFormas) {
      const marcadorEnCualquierForma = formasDibujadas.some(forma => esPuntoEnForma(posicionMarcador, forma));
      permitirCaptura = marcadorEnCualquierForma;
    } else {
      permitirCaptura = false;
    }

    // ❌ Ya no se bloquea si hay un documento cargado
    setPuedeCapturarMapa(permitirCaptura);
  }, [latitudActual, longitudActual, formasDibujadas]);

  return {
    control,
    handleSubmit,
    errors,
    latitudActual,
    longitudActual,
    adjuntoMapa,
    adjuntoDocumento,
    datosCapturaMapa,
    abrirVistaPreviaMapa,
    manejarCapturaMapa,
    manejarCambioArchivoUbicacion,
    cerrarVistaPreviaMapa,
    manejarClickMapa,
    limpiarAdjunto,
    onSubmit: enviarFormulario,
    abrirDialogoExito,
    mensajeExito,
    idInterferencia,
    resetearFormularioYMapa,
    abrirDialogoError,
    mensajeError,
    detallesError,
    cerrarDialogoError,
    setFormasDibujadas,
    puedeCapturarMapa,
    ubicaciones,
    agregarUbicacion: useCallback(() => append(defaultUbicacion), [append]),
    eliminarUbicacion: useCallback((index) => remove(index), [remove]),
  };
}