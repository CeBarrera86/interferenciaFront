import { useRef, useEffect } from 'react';
import { corpicoColores as colores } from '../../config/mapConstants';

export function useMarkers(mapRef, ubicaciones, isLoaded, onMarkerSet, pinActivoIndex) {
  const markersRef = useRef({});
  const activeMarkerRef = useRef(null);

  useEffect(() => {
    const MarkerClass = window?.google?.maps?.marker?.AdvancedMarkerElement;
    if (!isLoaded || !mapRef.current || typeof MarkerClass !== 'function') {
      console.warn('⚠️ AdvancedMarkerElement no disponible como constructor.');
      return;
    }

    Object.values(markersRef.current).forEach((marker) => (marker.map = null));
    markersRef.current = {};
    activeMarkerRef.current = null;

    ubicaciones.forEach((ubi, index) => {
      const marker = createMarker(index, ubi, MarkerClass);
      markersRef.current[index] = marker;
      if (index === pinActivoIndex) activeMarkerRef.current = marker;
    });
  }, [isLoaded, mapRef, ubicaciones]);

  function createMarker(index, ubi, MarkerClass) {
    const position = { lat: ubi.USI_LATITUD, lng: ubi.USI_LONGITUD };
    const color = colores[index % colores.length];
    const pin = document.createElement('div');
    pin.innerHTML = `
      <svg width="20" height="50" viewBox="0 0 8 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="4" fill="${color}" stroke="black" stroke-width="0.5" />
        <circle cx="4" cy="4" r="2" fill="white" stroke="black" stroke-width="0.5" />
        <path fill="${color}" stroke="black" stroke-width="0.5"
          d="M0 8 C2.5 12 3.5 18 4 24 C4.5 18 5.5 12 8 8 Q4 12 0 8 Z"
        />
      </svg>
    `;

    const marker = new MarkerClass({ map: mapRef.current, position, content: pin });

    marker.addListener('click', () => { onMarkerSet(index, position.lat, position.lng); });

    return marker;
  }

  function moverPinActivo(lat, lng) {
    if (activeMarkerRef.current) { activeMarkerRef.current.position = { lat, lng }; }
  }

  return { markersRef, moverPinActivo };
}