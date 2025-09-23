import { useState, useCallback } from 'react';

export function useArchivos(form) {
  const { setValue, getValues } = form;
  const [abrirVistaPreviaMapa, setAbrirVistaPreviaMapa] = useState(false);
  const [datosCapturaMapa, setDatosCapturaMapa] = useState(null);

  const convertirDataUrlEnArchivo = async (dataUrl) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], `mapa_${Date.now()}.png`, { type: 'image/png' });
  };

  const manejarCapturaMapa = useCallback(async (imageDataUrl) => {
    setDatosCapturaMapa(imageDataUrl);
    setAbrirVistaPreviaMapa(true);

    const file = await convertirDataUrlEnArchivo(imageDataUrl);
    setValue('SOI_MAPA', file, { shouldDirty: true });
  }, [setValue]);

  const manejarCambioArchivoUbicacion = useCallback((files) => {
    const archivosActuales = getValues('SOI_DOCUMENTO') || [];
    const nuevosArchivos = [...archivosActuales, ...files];
    setValue('SOI_DOCUMENTO', nuevosArchivos, { shouldDirty: true });
  }, [getValues, setValue]);

  const limpiarAdjunto = useCallback(() => {
    setValue('SOI_DOCUMENTO', [], { shouldDirty: true });
    setValue('SOI_MAPA', null);
    setDatosCapturaMapa(null);
  }, [setValue]);

  const limpiarCapturaMapa = useCallback(() => {
    setValue('SOI_MAPA', null);
    setDatosCapturaMapa(null);
  }, [setValue]);

  const cerrarVistaPreviaMapa = () => setAbrirVistaPreviaMapa(false);

  return {
    manejarCapturaMapa,
    manejarCambioArchivoUbicacion,
    limpiarAdjunto,
    cerrarVistaPreviaMapa,
    abrirVistaPreviaMapa,
    datosCapturaMapa,
    limpiarCapturaMapa,
  };
}
