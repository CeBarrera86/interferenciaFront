import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { hideElementsTemporarily, Maps_CONTROL_CLASSES } from '../../utils/mapUtils';

export function useScreenshot(mapContainerRef, mapRef, onMapScreenshotCallback, disableCaptureButton, buttonsToHideRefs = []) {
  const collectElementsToHide = () => {
    const elements = [];
    const mapDiv = mapRef.current?.getDiv();

    if (mapDiv) {
      Maps_CONTROL_CLASSES.forEach((selector) => {
        mapDiv.querySelectorAll(selector).forEach((el) => {
          elements.push({ element: el, originalDisplay: el.style.display });
        });
      });
    }

    buttonsToHideRefs.forEach((ref) => {
      if (ref.current) {
        elements.push({ element: ref.current, originalDisplay: ref.current.style.display });
      }
    });

    return elements;
  };

  const handleCaptureMap = useCallback(async () => {
    if (disableCaptureButton || !mapContainerRef.current) {
      console.warn('Captura deshabilitada o contenedor no disponible.');
      return;
    }

    const elementsToHide = collectElementsToHide();

    await hideElementsTemporarily(elementsToHide, async () => {
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imageDataUrl = canvas.toDataURL('image/png');
      onMapScreenshotCallback?.(imageDataUrl);
    });
  }, [disableCaptureButton, mapContainerRef, mapRef, onMapScreenshotCallback, buttonsToHideRefs]);

  return { handleCaptureMap };
}