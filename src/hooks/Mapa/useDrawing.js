import { useState, useCallback } from 'react';

export function useDrawing() {
  const [drawnShape, setDrawnShape] = useState(null);

  const handleMapClickForDrawing = useCallback((event) => {
    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    setDrawnShape((prevShape) => {
      // Si ya hay 4 puntos, no se puede agregar más
      if (prevShape?.type === 'polygon' && prevShape.path.length >= 4) {
        console.warn('Máximo de 4 vértices alcanzado');
        return prevShape;
      }

      const newPath = prevShape ? [...prevShape.path, newPoint] : [newPoint];
      return { type: 'polygon', path: newPath };
    });
  }, []);

  const clearAllShapes = useCallback(() => { setDrawnShape(null); }, []);

  return { drawnShape, setDrawnShape, handleMapClickForDrawing, clearAllShapes, };
}