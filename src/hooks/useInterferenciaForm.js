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
        alert(`Error al guardar: ${errorData.message || 'Error desconocido'}`);
        return false; // Indicate failure
      } else {
        const result = await response.json();
        alert('Formulario enviado con éxito!');
        reset();
        setActiveAttachmentType(null);
        setMapScreenshotData(null);
        return true;
      }
    } catch (error) {
      console.error('Error de red o en la petición (desde hook):', error);
      alert('Error de conexión o en la petición. Intente nuevamente.');
      return false;
    }
  }, [reset, setValue]);

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
    clearAttachment,
    onSubmit,
  };
}