import { useRef, useEffect } from 'react';
import { corpicoPalette as palette } from '../../styles/theme';

export function useMarkers(mapRef, ubicaciones, isLoaded, onMarkerSet, pinActivoIndex) {
  const markersRef = useRef({});

  useEffect(() => {
    if (
      !isLoaded ||
      !mapRef.current ||
      !window.google?.maps?.marker?.AdvancedMarkerElement
    ) return;

    const colores = Object.values(palette);

    // Limpiar marcadores anteriores
    Object.values(markersRef.current).forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = {};

    // Crear marcador por cada ubicación
    ubicaciones.forEach((ubi, index) => {
      if (!ubi?.USI_LATITUD || !ubi?.USI_LONGITUD) return;

      const position = new google.maps.LatLng(ubi.USI_LATITUD, ubi.USI_LONGITUD);
      const color = index === pinActivoIndex ? '#e22b14' : colores[index % colores.length];

      const calle = ubi.USI_CALLE || '';
      const altura = ubi.USI_ALTURA || '';
      const tooltip = `${calle} ${altura}`.trim();

      const pin = document.createElement('div');
      pin.style.display = 'flex';
      pin.style.alignItems = 'center';
      pin.style.justifyContent = 'center';

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

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position,
        content: pin,
      });

      marker.addListener('click', () => {
        onMarkerSet(index, position.lat(), position.lng());
      });

      markersRef.current[index] = marker;
    });
  }, [isLoaded, mapRef, ubicaciones, onMarkerSet, pinActivoIndex]);

  return { markersRef };
}