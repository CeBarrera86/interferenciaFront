import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { hideElementsTemporarily, Maps_CONTROL_CLASSES } from '../../utils/mapUtils';

/**
 * Hook de React para manejar la captura de pantalla de un componente de mapa.
 * @param {React.MutableRefObject} mapContainerRef - Referencia al contenedor del mapa.
 * @param {React.MutableRefObject} mapRef - Referencia al objeto del mapa de Google.
 * @param {Function} onMapScreenshotCallback - Callback que se ejecuta con los datos de la imagen capturada.
 * @param {boolean} disableCaptureButton - Si el botón de captura debe estar deshabilitado.
 * @param {Array<React.MutableRefObject>} buttonsToHideRefs - Referencias a otros botones para ocultar durante la captura.
 */
export function useScreenshot(mapContainerRef, mapRef, onMapScreenshotCallback, disableCaptureButton, buttonsToHideRefs = []) {

  const handleCaptureMap = useCallback(async () => {
    if (disableCaptureButton) {
      return;
    }
    if (!mapContainerRef.current) {
      console.warn('Map container ref is not available.');
      return;
    }

    const elementsToHide = [];
    const mapDiv = mapRef.current?.getDiv();

    if (mapDiv) {
      // Ocultar los controles predeterminados de Google Maps
      Maps_CONTROL_CLASSES.forEach(className => {
        mapDiv.querySelectorAll(className).forEach(el => {
          elementsToHide.push({ element: el, originalDisplay: el.style.display });
        });
      });
    }

    // Ocultar los botones de la interfaz de usuario que no deben aparecer en la captura
    buttonsToHideRefs.forEach(ref => {
      if (ref.current) {
        elementsToHide.push({ element: ref.current, originalDisplay: ref.current.style.display });
      }
    });

    // Usar la función utilitaria para ocultar temporalmente los elementos
    await hideElementsTemporarily(elementsToHide, async () => {
      // Capturar el mapa a un canvas
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        logging: true,
      });

      // Convertir el canvas a una URL de datos
      const imageDataUrl = canvas.toDataURL('image/png');

      // Ejecutar el callback con los datos de la imagen
      if (onMapScreenshotCallback) {
        onMapScreenshotCallback(imageDataUrl);
      }
    });
  }, [mapContainerRef, mapRef, onMapScreenshotCallback, disableCaptureButton, buttonsToHideRefs]);

  return { handleCaptureMap };
}