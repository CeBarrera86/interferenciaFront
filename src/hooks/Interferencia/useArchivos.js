import { useState, useCallback } from 'react';

export function useArchivos(form, formasDibujadas) {
  const { setValue } = form;
  const [abrirVistaPreviaMapa, setAbrirVistaPreviaMapa] = useState(false);
  const [datosCapturaMapa, setDatosCapturaMapa] = useState(null);

  const manejarCapturaMapa = useCallback(async (imageDataUrl) => {
    setDatosCapturaMapa(imageDataUrl);
    setAbrirVistaPreviaMapa(true);

    const res = await fetch(imageDataUrl);
    const blob = await res.blob();
    const file = new File([blob], `mapa_${Date.now()}.png`, { type: 'image/png' });

    setValue('SOI_MAPA', file, { shouldDirty: true });
  }, [setValue]);

  const manejarCambioArchivoUbicacion = useCallback((file) => {
    setValue('SOI_DOCUMENTO', file, { shouldDirty: true });
  }, [setValue]);

  const limpiarAdjunto = useCallback(() => {
    setValue('SOI_DOCUMENTO', null);
    setValue('SOI_MAPA', null);
    setDatosCapturaMapa(null);
    formasDibujadas.length = 0;
  }, [setValue, formasDibujadas]);

  const cerrarVistaPreviaMapa = () => setAbrirVistaPreviaMapa(false);

  return {
    manejarCapturaMapa,
    manejarCambioArchivoUbicacion,
    limpiarAdjunto,
    cerrarVistaPreviaMapa,
    abrirVistaPreviaMapa,
    datosCapturaMapa,
  };
}
