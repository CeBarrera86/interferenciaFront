import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { interferenciasSchema } from '../validation/interferenciasSchema';

export function useInterferenciaForm() {
  const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(interferenciasSchema),
    defaultValues: {
      SOI_CUIT: '',
      SOI_NOMBRE: '',
      SOI_APELLIDO: '',
      SOI_PERSONA: 'F',
      SOI_EMAIL: '',
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
      SOI_ADJUNTO: null,
      SOI_DESDE: null,
      SOI_HASTA: null,
    },
  });

  const currentLat = watch('SOI_LATITUD');
  const currentLng = watch('SOI_LONGITUD');
  const existingAdjunto = watch('SOI_ADJUNTO');
  const [mapScreenshotData, setMapScreenshotData] = useState(null);
  const [openMapPreview, setOpenMapPreview] = useState(false);
  const [activeAttachmentType, setActiveAttachmentType] = useState(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [interferenciaId, setInterferenciaId] = useState(null);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [canCaptureMap, setCanCaptureMap] = useState(false);

  useEffect(() => {
    if (existingAdjunto) {
      if (existingAdjunto instanceof File && existingAdjunto.name && existingAdjunto.name.startsWith('map_screenshot')) {
        setActiveAttachmentType('map');
      } else if (existingAdjunto instanceof File) {
        setActiveAttachmentType('file');
      }
    } else {
      setActiveAttachmentType(null);
    }
  }, [existingAdjunto]);

  const handleMapScreenshot = useCallback((imageDataUrl) => {
    console.log('Captura del mapa recibida en hook.');
    setMapScreenshotData(imageDataUrl);

    if (imageDataUrl && typeof imageDataUrl === 'string') {
      // Convertir data URL a File Blob
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
      setOpenMapPreview(true);
    } else {
      console.warn("handleMapScreenshot llamado sin datos de imagen válidos.");
    }
  }, [setValue]);

  const handleFormUbicacionFileChange = useCallback((file) => {
    setValue('SOI_ADJUNTO', file, { shouldDirty: true });
    setMapScreenshotData(null);
  }, [setValue]);

  const handleCloseMapPreview = useCallback(() => {
    setOpenMapPreview(false);
  }, []);

  const handleMapClick = useCallback((lat, lng) => {
    setValue('SOI_LATITUD', lat);
    setValue('SOI_LONGITUD', lng);
  }, [setValue]);

  const clearAttachment = useCallback(() => {
    setValue('SOI_ADJUNTO', null, { shouldDirty: true });
    setMapScreenshotData(null);
  }, [setValue]);

  const resetFormAndMap = useCallback(() => {
    reset();
    setValue('SOI_LATITUD', -35.65867);
    setValue('SOI_LONGITUD', -63.75715);
    setValue('SOI_ADJUNTO', null);
    setMapScreenshotData(null);
    setActiveAttachmentType(null);
    setOpenSuccessDialog(false);
    setSuccessMessage('');
    setInterferenciaId(null);
    setOpenErrorDialog(false);
    setErrorMessage('');
    setErrorDetails('');
    setDrawnShapes([]);
    setCanCaptureMap(false);
  }, [reset, setValue]);

  const handleErrorDialogClose = useCallback(() => {
    setOpenErrorDialog(false);
    setErrorMessage('');
    setErrorDetails('');
  }, []);

  // Verifica si un punto está dentro de una forma
  const isPointInShape = useCallback((point, shape) => {
    if (!window.google || !window.google.maps || !window.google.maps.geometry) {
      console.warn("Google Maps API (o la librería geometry) no está cargada para isPointInShape.");
      return false;
    }
    const googlePoint = new window.google.maps.LatLng(point.lat, point.lng);

    if (shape.type === 'polygon' && shape.googleObject) {
      return window.google.maps.geometry.poly.containsLocation(googlePoint, shape.googleObject);
    } else if (shape.type === 'rectangle' && shape.googleObject) {
      return shape.googleObject.getBounds().contains(googlePoint);
    } else if (shape.type === 'circle' && shape.googleObject) {
      const center = shape.googleObject.getCenter();
      const radius = shape.googleObject.getRadius();
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(googlePoint, center);
      return distance <= radius;
    }
    return false;
  }, []);

  // Determina si se puede capturar el mapa
  useEffect(() => {
    const defaultLat = -35.65867;
    const defaultLng = -63.75715;
    const markerIsSet = (currentLat !== defaultLat || currentLng !== defaultLng);
    const hasDrawnShapes = drawnShapes.length > 0;
    const markerPosition = { lat: currentLat, lng: currentLng };

    let allowCapture = false;

    if (markerIsSet && !hasDrawnShapes) {
      // Condición 1: Solo se marcó con el pin rojo la ubicación
      allowCapture = true;
    } else if (markerIsSet && hasDrawnShapes) {
      // Condición 2: El marcador rojo se encuentra dentro del área dibujada
      const markerInAnyShape = drawnShapes.some(shape => isPointInShape(markerPosition, shape));
      if (markerInAnyShape) {
        allowCapture = true;
      } else {
        // Excluido: Hay dibujos pero el marcador no está dentro
        allowCapture = false;
      }
    } else {
      // Ni marcador ni dibujos, o solo dibujos sin marcador
      allowCapture = false;
    }

    // Si ya existe un adjunto que no es una captura de mapa, la captura del mapa no debe estar permitida
    if (existingAdjunto && !(existingAdjunto instanceof File && existingAdjunto.name && existingAdjunto.name.startsWith('map_screenshot'))) {
      allowCapture = false;
    }

    setCanCaptureMap(allowCapture);
  }, [currentLat, currentLng, drawnShapes, isPointInShape, existingAdjunto]);


  const onSubmit = useCallback(async (data) => {
    console.log('Datos a enviar (desde hook):', data);

    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] instanceof Date) {
          formData.append(key, data[key].toISOString());
        } else if (data[key] instanceof File) {
          formData.append(key, data[key], data[key].name);
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    try {
      const response = await fetch('http://localhost:3000/api/interferencia/store', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al enviar el formulario (desde hook):', response.status, errorData);

        setErrorMessage(errorData.message || 'Error desconocido al procesar la solicitud.');
        setErrorDetails(errorData.error || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || '');
        setOpenErrorDialog(true);
        return false;
      } else {
        const result = await response.json();
        console.log('Formulario enviado con éxito (desde hook):', result);

        setSuccessMessage(result.message);
        setInterferenciaId(result.id);
        setOpenSuccessDialog(true);
        return true;
      }
    } catch (error) {
      console.error('Error de red o en la petición (desde hook):', error);
      setErrorMessage('Error de conexión. No se pudo llegar al servidor.');
      setErrorDetails(error.message);
      setOpenErrorDialog(true);
      return false;
    }
  }, []);

  return {
    control,
    handleSubmit,
    errors,
    currentLat,
    currentLng,
    existingAdjunto,
    mapScreenshotData,
    openMapPreview,
    activeAttachmentType,
    handleMapScreenshot,
    handleFormUbicacionFileChange,
    handleCloseMapPreview,
    handleMapClick,
    cleanAttachment: clearAttachment,
    onSubmit,
    openSuccessDialog,
    successMessage,
    interferenciaId,
    resetFormAndMap,
    openErrorDialog,
    errorMessage,
    errorDetails,
    handleErrorDialogClose,
    setDrawnShapes,
    canCaptureMap,
  };
}