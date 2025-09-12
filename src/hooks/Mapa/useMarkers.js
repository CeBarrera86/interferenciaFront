import { useRef, useEffect } from 'react';
import { corpicoColores as colores } from '../../config/mapConstants';

export function useMarkers(mapRef, ubicaciones, isLoaded, onMarkerSet, pinActivoIndex) {
  const markersRef = useRef({});
  const activeMarkerRef = useRef(null);

  // Crear todos los marcadores (solo cuando cambia la cantidad)
  useEffect(() => {
    const MarkerClass = window?.google?.maps?.marker?.AdvancedMarkerElement;

    /* Verifica que la API de Google Maps esté cargada correctamente y 
     * que el constructor AdvancedMarkerElement esté disponible.
     * Si no lo está, evita crear marcadores para prevenir errores de ejecución
     */
    if (!isLoaded || !mapRef.current || typeof MarkerClass !== 'function') {
      console.warn('⚠️ AdvancedMarkerElement no disponible como constructor.');
      return;
    }

    Object.values(markersRef.current).forEach((marker) => marker.map = null);
    markersRef.current = {};
    activeMarkerRef.current = null;

    ubicaciones.forEach((ubi, index) => {
      const marker = createMarker(index, ubi, MarkerClass);
      markersRef.current[index] = marker;
      if (index === pinActivoIndex) activeMarkerRef.current = marker;
    });
  }, [isLoaded, mapRef, ubicaciones.length]);

  // Crear marcador individual
  function createMarker(index, ubi, MarkerClass) {
    const position = { lat: ubi.USI_LATITUD, lng: ubi.USI_LONGITUD };
    const color = colores[index % colores.length];
    const calle = ubi.USI_CALLE || '';
    const altura = ubi.USI_ALTURA || '';
    const tooltip = `${calle} ${altura}`.trim();

    const pin = document.createElement('div');
    pin.innerHTML = `
      <div style="position: relative;">
        <svg width="20" height="50" viewBox="0 0 8 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="4" fill="${color}" stroke="black" stroke-width="0.5" />
          <circle cx="4" cy="4" r="2" fill="white" stroke="black" stroke-width="0.5" />
          <path fill="${color}" stroke="black" stroke-width="0.5"
            d="M0 8 C2.5 12 3.5 18 4 24 C4.5 18 5.5 12 8 8 Q4 12 0 8 Z"
          />
        </svg>
        ${tooltip ? `
          <div style="
            position: absolute;
            top: -22px;
            left: -20px;
            background: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            box-shadow: 0 0 2px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">
            ${tooltip}
          </div>` : ''}
      </div>
    `;

    const marker = new MarkerClass({
      map: mapRef.current,
      position,
      content: pin,
    });

    marker.addListener('click', () => {
      onMarkerSet(index, position.lat, position.lng);
    });

    return marker;
  }

  // Mover el pin activo directamente
  function moverPinActivo(lat, lng) {
    if (activeMarkerRef.current) {
      activeMarkerRef.current.position = { lat, lng };
    }
  }

  return { markersRef, moverPinActivo };
}