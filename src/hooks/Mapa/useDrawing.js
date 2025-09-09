import { useState, useCallback } from 'react';

export function useDrawing() {
  const [drawnShape, setDrawnShape] = useState(null);

  const handleMapClickForDrawing = useCallback((event) => {
    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng(), };

    setDrawnShape(prevShape => {
      // Si ya hay un shape, agregamos un punto. Si no, creamos el primero.
      const newPath = prevShape ? [...prevShape.path, newPoint] : [newPoint];
      return { type: 'polygon', path: newPath };
    });
  }, []);

  const clearAllShapes = useCallback(() => { setDrawnShape(null); }, []);

  const handleShapeChange = useCallback((shapeObject) => {
    if (!shapeObject) return;

    // Convertimos los LatLng de Google Maps a un array de objetos
    const newPath = shapeObject.getPath().getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng(), }));

    setDrawnShape({ type: 'polygon', path: newPath });
  }, []);

  return {
    drawnShape,
    handleMapClickForDrawing,
    clearAllShapes,
    handleShapeChange,
  };
}