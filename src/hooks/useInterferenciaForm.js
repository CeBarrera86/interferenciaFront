import { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { interferenciasSchema } from '../validation/interferenciasSchema';
import { esPuntoEnForma } from '../utils/mapUtils';

// Definir los valores por defecto para una nueva ubicación
const defaultUbicacion = {
  SOI_CALLE: '',
  SOI_ALTURA: '',
  SOI_PISO: '',
  SOI_DPTO: '',
  SOI_VEREDA: 'P',
  SOI_ENTRE1: '',
  SOI_ENTRE2: '',
  SOI_LOCALIDAD_ID: '',
  SOI_LATITUD: -35.65867,
  SOI_LONGITUD: -63.75715,
};

export function useInterferenciaForm() {
  const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(interferenciasSchema),
    defaultValues: {
      SOI_CUIT: '',
      SOI_NOMBRE: '',
      SOI_APELLIDO: '',
      SOI_PERSONA: 'F',
      SOI_EMAIL: '',
      SOI_DESDE: null,
      SOI_HASTA: null,
      SOI_ADJUNTO: null,
      SOI_UBICACIONES: [defaultUbicacion],
    },
  });

  const { fields: ubicaciones, append, remove } = useFieldArray({
    control,
    name: 'SOI_UBICACIONES',
  });

  const adjuntoExistente = watch('SOI_ADJUNTO');
  const [datosCapturaMapa, setDatosCapturaMapa] = useState(null);
  const [abrirVistaPreviaMapa, setAbrirVistaPreviaMapa] = useState(false);
  const [tipoAdjuntoActivo, setTipoAdjuntoActivo] = useState(null);
  const [abrirDialogoExito, setAbrirDialogoExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [idInterferencia, setIdInterferencia] = useState(null);
  const [abrirDialogoError, setAbrirDialogoError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [detallesError, setDetallesError] = useState('');
  const [formasDibujadas, setFormasDibujadas] = useState([]);
  const [puedeCapturarMapa, setPuedeCapturarMapa] = useState(false);

  useEffect(() => {
    if (adjuntoExistente) {
      if (adjuntoExistente instanceof File && adjuntoExistente.name && adjuntoExistente.name.startsWith('map_screenshot')) {
        setTipoAdjuntoActivo('map');
      } else if (adjuntoExistente instanceof File) {
        setTipoAdjuntoActivo('file');
      }
    } else {
      setTipoAdjuntoActivo(null);
    }
  }, [adjuntoExistente]);

  // Función para agregar una nueva ubicación con los valores por defecto
  const agregarUbicacion = useCallback(() => {
    append(defaultUbicacion);
  }, [append]);

  // Función para eliminar una ubicación
  const eliminarUbicacion = useCallback((index) => {
    remove(index);
  }, [remove]);

  const manejarCapturaMapa = useCallback((imageDataUrl) => {
    setDatosCapturaMapa(imageDataUrl);

    if (imageDataUrl && typeof imageDataUrl === 'string') {
      const byteString = atob(imageDataUrl.split(',')[1]);
      const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], 'map_screenshot.png', { type: mimeString });

      setValue('SOI_ADJUNTO', file, { shouldDirty: true });
      setAbrirVistaPreviaMapa(true);
    } else {
      console.warn("manejarCapturaMapa llamado sin datos de imagen válidos.");
    }
  }, [setValue]);

  const manejarCambioArchivoUbicacion = useCallback((file) => {
    setValue('SOI_ADJUNTO', file, { shouldDirty: true });
    setDatosCapturaMapa(null);
  }, [setValue]);

  const cerrarVistaPreviaMapa = useCallback(() => {
    setAbrirVistaPreviaMapa(false);
  }, []);

  const manejarClickMapa = useCallback((lat, lng, ubicacionIndex = 0) => {
    setValue(`SOI_UBICACIONES.${ubicacionIndex}.SOI_LATITUD`, lat, { shouldValidate: true });
    setValue(`SOI_UBICACIONES.${ubicacionIndex}.SOI_LONGITUD`, lng, { shouldValidate: true });
  }, [setValue]);

  const limpiarAdjunto = useCallback(() => {
    setValue('SOI_ADJUNTO', null, { shouldDirty: true });
    setDatosCapturaMapa(null);
  }, [setValue]);

  const resetearFormularioYMapa = useCallback(() => {
    reset();
    setValue('SOI_UBICACIONES', [defaultUbicacion]);
    setValue('SOI_ADJUNTO', null);
    setDatosCapturaMapa(null);
    setTipoAdjuntoActivo(null);
    setAbrirDialogoExito(false);
    setMensajeExito('');
    setIdInterferencia(null);
    setAbrirDialogoError(false);
    setMensajeError('');
    setDetallesError('');
    setFormasDibujadas([]);
    setPuedeCapturarMapa(false);
  }, [reset, setValue]);

  const cerrarDialogoError = useCallback(() => {
    setAbrirDialogoError(false);
    setMensajeError('');
    setDetallesError('');
  }, []);

  useEffect(() => {
    const ubicacionActiva = ubicaciones[0];
    const marcadorEstablecido = (ubicacionActiva?.SOI_LATITUD !== -35.65867 || ubicacionActiva?.SOI_LONGITUD !== -63.75715);
    const hayFormasDibujadas = formasDibujadas.length > 0;
    const posicionMarcador = { lat: ubicacionActiva?.SOI_LATITUD, lng: ubicacionActiva?.SOI_LONGITUD };

    let permitirCaptura = false;

    if (marcadorEstablecido && !hayFormasDibujadas) {
      permitirCaptura = true;
    } else if (marcadorEstablecido && hayFormasDibujadas) {
      const marcadorEnCualquierForma = formasDibujadas.some(forma => esPuntoEnForma(posicionMarcador, forma));
      if (marcadorEnCualquierForma) {
        permitirCaptura = true;
      } else {
        permitirCaptura = false;
      }
    } else {
      permitirCaptura = false;
    }

    if (adjuntoExistente && !(adjuntoExistente instanceof File && adjuntoExistente.name && adjuntoExistente.name.startsWith('map_screenshot'))) {
      permitirCaptura = false;
    }

    setPuedeCapturarMapa(permitirCaptura);
  }, [ubicaciones, formasDibujadas, adjuntoExistente]);

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
        } else if (data[key] instanceof Date) {
          formData.append(key, data[key].toISOString());
        } else if (data[key] instanceof File) {
          formData.append(key, data[key], data[key].name);
        } else if (key === 'SOI_SERVICIO' && Array.isArray(data[key])) {
          // Aquí se transforman los servicios a una cadena antes de enviarlos
          formData.append(key, data[key].join(','));
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    // Log para ver cómo se está construyendo el FormData (opcional)
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await fetch('http://localhost:3000/api/interferencia/store', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al enviar el formulario (desde hook):', response.status, errorData);

        setMensajeError(errorData.message || 'Error desconocido al procesar la solicitud.');
        setDetallesError(errorData.error || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || '');
        setAbrirDialogoError(true);
        return false;
      } else {
        const result = await response.json();
        console.log('Formulario enviado con éxito (desde hook):', result);

        setMensajeExito(result.message);
        setIdInterferencia(result.id);
        setAbrirDialogoExito(true);
        return true;
      }
    } catch (error) {
      console.error('Error de red o en la petición (desde hook):', error);
      setMensajeError('Error de conexión. No se pudo llegar al servidor.');
      setDetallesError(error.message);
      setAbrirDialogoError(true);
      return false;
    }
  }, []);

  // Latitud y longitud de la primera ubicación, lo cual está bien si solo hay un marcador en el mapa.
  const latitudActual = watch('SOI_UBICACIONES.0.SOI_LATITUD');
  const longitudActual = watch('SOI_UBICACIONES.0.SOI_LONGITUD');

  return {
    control,
    handleSubmit,
    errors,
    ubicaciones,
    agregarUbicacion,
    eliminarUbicacion,
    latitudActual,
    longitudActual,
    adjuntoExistente,
    datosCapturaMapa,
    abrirVistaPreviaMapa,
    tipoAdjuntoActivo,
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
  };
}