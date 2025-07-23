import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { hideElementsTemporarily, Maps_CONTROL_CLASSES } from '../utils/mapUtils';

export function useMapScreenshot(mapContainerRef, mapRef, onMapScreenshotCallback, disableCaptureButton, buttonsToHideRefs = []) {

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

    buttonsToHideRefs.forEach(ref => {
      if (ref.current) {
        elementsToHide.push({ element: ref.current, originalDisplay: ref.current.style.display });
      }
    });

    await hideElementsTemporarily(elementsToHide, async () => {
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
      });

      const imageDataUrl = canvas.toDataURL('image/png');

      if (onMapScreenshotCallback) {
        onMapScreenshotCallback(imageDataUrl);
      }
    });
  }, [onMapScreenshotCallback, disableCaptureButton, mapContainerRef, mapRef, buttonsToHideRefs]);

  return { handleCaptureMap };
}