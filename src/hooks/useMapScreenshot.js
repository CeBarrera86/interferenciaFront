import { useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import { hideElementsTemporarily, Maps_CONTROL_CLASSES } from '../utils/mapUtils';

export function useMapScreenshot(mapContainerRef, mapRef, onMapScreenshotCallback, disableCaptureButton) {
  const captureButtonRef = useRef(null);

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
      Maps_CONTROL_CLASSES.forEach(className => {
        mapDiv.querySelectorAll(className).forEach(el => {
          elementsToHide.push({ element: el, originalDisplay: el.style.display });
        });
      });
    }

    if (captureButtonRef.current) {
      elementsToHide.push({ element: captureButtonRef.current, originalDisplay: captureButtonRef.current.style.display });
    }

    await hideElementsTemporarily(elementsToHide, async () => {
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
      });

      const imageDataUrl = canvas.toDataURL('image/png');

      if (onMapScreenshotCallback) {
        onMapScreenshotCallback(imageDataUrl);
      }
    });
  }, [onMapScreenshotCallback, disableCaptureButton, mapContainerRef, mapRef]); // Dependencias correctas

  return { captureButtonRef, handleCaptureMap };
}