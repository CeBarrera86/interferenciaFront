import { useState, useRef, useEffect, useCallback } from 'react';

export function useMapMarker(mapRef, initialPosition, isLoaded, onMapClickCallback) {
  const markerRef = useRef(null);
  const [currentMarker, setCurrentMarker] = useState(initialPosition);

  // Sincroniza la posición inicial con el estado interno
  useEffect(() => {
    if (initialPosition && (initialPosition.lat !== currentMarker.lat || initialPosition.lng !== currentMarker.lng)) {
      setCurrentMarker(initialPosition);
    }
  }, [initialPosition, currentMarker]);

  const createOrUpdateMarker = useCallback(() => {
    if (isLoaded && mapRef.current && window.google?.maps?.marker) {
      const { AdvancedMarkerElement, PinElement } = window.google.maps.marker;

      if (markerRef.current) {
        markerRef.current.map = null;
      }

      const pin = new PinElement({ background: 'red', glyphColor: 'white', borderColor: 'darkred', });
      const marker = new AdvancedMarkerElement({ map: mapRef.current, position: currentMarker, content: pin.element, });

      markerRef.current = marker;
    }
  }, [isLoaded, mapRef, currentMarker]);

  // crear/actualizar el marcador cuando currentMarker o isLoaded cambian
  useEffect(() => {
    createOrUpdateMarker();
  }, [currentMarker, createOrUpdateMarker]);

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCurrentMarker({ lat, lng });
    onMapClickCallback(lat, lng);
  }, [onMapClickCallback]);

  return { currentMarker, handleMapClick, createOrUpdateMarker };
}