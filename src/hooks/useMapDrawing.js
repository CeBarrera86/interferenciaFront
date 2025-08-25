import { useState, useCallback, useRef } from 'react';

export function useMapDrawing(drawingManagerRef, isLoaded, onDrawnShapesChange) {
  const [drawnOverlays, setDrawnOverlays] = useState([]);

  const clearAllOverlays = useCallback(() => {
    drawnOverlays.forEach(overlay => {
      overlay.setMap(null);
    });
    setDrawnOverlays([]);
    onDrawnShapesChange([]);
  }, [drawnOverlays, onDrawnShapesChange]);

  const onOverlayComplete = useCallback((overlayEvent) => {
    clearAllOverlays();

    const newOverlay = overlayEvent.overlay;
    setDrawnOverlays([newOverlay]);

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
      onDrawnShapesChange([newShape]);
      drawingManagerRef.current?.setDrawingMode(null);

      if (newShape.type === 'polygon') {
        newShape.googleObject.getPaths().forEach(path => {
          window.google.maps.event.addListener(path, 'insert_at', () => onDrawnShapesChange([newShape]));
          window.google.maps.event.addListener(path, 'set_at', () => onDrawnShapesChange([newShape]));
          window.google.maps.event.addListener(path, 'remove_at', () => onDrawnShapesChange([newShape]));
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
          onDrawnShapesChange([newShape]);
        });
      }
    }
  }, [clearAllOverlays, onDrawnShapesChange, drawingManagerRef]);

  return {
    onOverlayComplete,
    drawnShapes: drawnOverlays,
    clearAllOverlays,
  };
}