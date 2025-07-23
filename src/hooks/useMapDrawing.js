import { useState, useCallback, useRef, useMemo } from 'react';
import { getDrawingManagerOptions as getBaseDrawingManagerOptions } from '../config/mapOptions';

export function useMapDrawing(isLoaded, onDrawnShapesChange) {
  const drawingManagerRef = useRef(null);
  const [drawnOverlays, setDrawnOverlays] = useState([]);
  const [drawnShapes, setDrawnShapesState] = useState([]);

  // Actualiza el estado local y notifica al padre
  const setDrawnShapes = useCallback((newShapes) => {
    setDrawnShapesState(newShapes);
    if (onDrawnShapesChange) {
      onDrawnShapesChange(newShapes);
    }
  }, [onDrawnShapesChange]);

  const onDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);

  const onOverlayComplete = useCallback((overlayEvent) => {
    // Limpiar overlays anteriores si solo se permite uno
    if (drawnOverlays.length > 0) {
      drawnOverlays.forEach(overlay => overlay.setMap(null));
      setDrawnOverlays([]);
      setDrawnShapes([]); // También limpiar las formas lógicas
    }

    const newOverlay = overlayEvent.overlay;
    setDrawnOverlays([newOverlay]); // Almacenar solo el nuevo overlay

    let newShape = null;
    if (overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
      const paths = newOverlay.getPaths().getArray().map(path => path.getArray().map(latLng => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      })));
      newShape = { type: 'polygon', paths, googleObject: newOverlay };
    } else if (overlayEvent.type === window.google.maps.drawing.OverlayType.RECTANGLE) {
      const bounds = newOverlay.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      newShape = {
        type: 'rectangle',
        bounds: {
          north: northEast.lat(),
          east: northEast.lng(),
          south: southWest.lat(),
          west: southWest.lng(),
        },
        googleObject: newOverlay,
      };
    }

    if (newShape) {
      setDrawnShapes([newShape]); // Almacenar solo la nueva forma
      drawingManagerRef.current?.setDrawingMode(null);

      // Añadir listeners para cambios en la forma (edición)
      if (newShape.type === 'polygon') {
        newShape.googleObject.getPaths().forEach(path => {
          window.google.maps.event.addListener(path, 'insert_at', () => setDrawnShapes([newShape]));
          window.google.maps.event.addListener(path, 'set_at', () => setDrawnShapes([newShape]));
          window.google.maps.event.addListener(path, 'remove_at', () => setDrawnShapes([newShape]));
        });
      } else if (newShape.type === 'rectangle') {
        window.google.maps.event.addListener(newShape.googleObject, 'bounds_changed', () => {
          const bounds = newShape.googleObject.getBounds();
          const northEast = bounds.getNorthEast();
          const southWest = bounds.getSouthWest();
          newShape.bounds = {
            north: northEast.lat(),
            east: northEast.lng(),
            south: southWest.lat(),
            west: southWest.lng(),
          };
          setDrawnShapes([newShape]);
        });
      }
    }
  }, [drawnOverlays, setDrawnShapes]);

  const clearAllOverlays = useCallback(() => {
    drawnOverlays.forEach(overlay => {
      overlay.setMap(null);
    });
    setDrawnOverlays([]);
    setDrawnShapes([]);
  }, [drawnOverlays, setDrawnShapes]);

  const drawingManagerOptions = useMemo(() => {
    if (isLoaded && window.google?.maps?.drawing) {
      return getBaseDrawingManagerOptions();
    }
    return null;
  }, [isLoaded]);

  return {
    drawingManagerRef,
    onDrawingManagerLoad,
    onOverlayComplete,
    drawnShapes,
    drawingManagerOptions,
    clearAllOverlays
  };
}