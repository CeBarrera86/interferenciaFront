import { useRef, useState, useCallback, useMemo } from 'react';
import { getDrawingManagerOptions as getBaseDrawingManagerOptions } from '../config/mapOptions';

export function useMapDrawing(isLoaded) {
  const drawingManagerRef = useRef(null);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const onDrawingManagerLoad = useCallback((drawingManager) => { drawingManagerRef.current = drawingManager; }, []);

  const onOverlayComplete = useCallback((overlayEvent) => {
    let newShape = null;
    if (overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
      const paths = overlayEvent.overlay.getPaths().getArray().map(path => path.getArray().map(latLng => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      })));
      newShape = { type: 'polygon', paths };
    } else if (overlayEvent.type === window.google.maps.drawing.OverlayType.CIRCLE) {
      const center = overlayEvent.overlay.getCenter();
      const radius = overlayEvent.overlay.getRadius();
      newShape = {
        type: 'circle',
        center: { lat: center.lat(), lng: center.lng() },
        radius,
      };
    }
    if (newShape) {
      setDrawnShapes(prevShapes => [...prevShapes, newShape]);
      drawingManagerRef.current?.setDrawingMode(null);
    }
  }, []);

  // Para calcular las opciones al cambiar isLoaded o window.google
  const drawingManagerOptions = useMemo(() => {
    if (isLoaded && window.google?.maps?.drawing) {
      return getBaseDrawingManagerOptions();
    }
    return null;
  }, [isLoaded]);

  return { drawingManagerRef, onDrawingManagerLoad, onOverlayComplete, drawnShapes, drawingManagerOptions };
}