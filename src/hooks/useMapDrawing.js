import { useRef, useState, useCallback, useMemo } from 'react';
import { getDrawingManagerOptions as getBaseDrawingManagerOptions } from '../config/mapOptions';

export function useMapDrawing(isLoaded) {
  const drawingManagerRef = useRef(null);
  const [drawnOverlays, setDrawnOverlays] = useState([]);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const onDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);
  const onOverlayComplete = useCallback((overlayEvent) => {
    setDrawnOverlays(prev => [...prev, overlayEvent.overlay]);

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
    } else if (overlayEvent.type === window.google.maps.drawing.OverlayType.POLYLINE) {
        const path = overlayEvent.overlay.getPath().getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
        }));
        newShape = { type: 'polyline', path };
    } else if (overlayEvent.type === window.google.maps.drawing.OverlayType.RECTANGLE) {
        const bounds = overlayEvent.overlay.getBounds();
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
        };
    }

    if (newShape) {
      setDrawnShapes(prevShapes => [...prevShapes, newShape]);
      drawingManagerRef.current?.setDrawingMode(null);
    }
  }, []);

  const clearAllOverlays = useCallback(() => {
    drawnOverlays.forEach(overlay => {
      overlay.setMap(null);
    });
    setDrawnOverlays([]);
    setDrawnShapes([]);
  }, [drawnOverlays]);

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