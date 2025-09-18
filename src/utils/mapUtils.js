/**
 * Oculta temporalmente los elementos especificados en el DOM, ejecuta una función de callback,
 * y luego restaura la visibilidad de los elementos.
 * @param {Array<{element: HTMLElement, originalDisplay: string}>} elementsToProcess - Array de objetos con el elemento DOM y su estilo 'display' original.
 * @param {Function} callback - Función asíncrona a ejecutar mientras los elementos están ocultos.
 * @returns {Promise<void>}
 */
export const hideElementsTemporarily = async (elementsToProcess, callback) => {
  elementsToProcess.forEach(({ element }) => {
    if (element) { element.style.setProperty('display', 'none', 'important'); }
  });

  await new Promise(resolve => setTimeout(resolve, 50));

  try {
    await callback();
  } finally {
    // Restaurar los estilos originales de los elementos
    elementsToProcess.forEach(({ element, originalDisplay }) => {
      if (element) { element.style.display = originalDisplay; }
    });
  }
};

/**
 * Define las clases CSS conocidas de los controles de Google Maps que deben ser ocultadas antes de una captura.
 */
export const Maps_CONTROL_CLASSES = [
  '.gmnoprint',
  '.gm-fullscreen-control',
  '.gm-svpc',
  '.gmnoprint[draggable="false"]',
  '.gmnoprint[role="group"]',
];

/**
 * Verifica si un punto está dentro de un polígono definido por un array de coordenadas [{lat, lng}]
 * @param {{lat: number, lng: number}} punto - Punto a verificar
 * @param {Array<{lat: number, lng: number}>} path - Array de coordenadas del polígono
 * @returns {boolean}
 */
export function isMarkerInsidePolygon(markerPosition, polygonPath) {
  if (!window.google) {
    console.warn('Google Maps API not loaded.');
    return false;
  }

  // Ensure the polygon path has enough points to form a polygon
  if (!polygonPath || polygonPath.length < 3) {
    return false;
  }

  // Create a google.maps.Polygon object from the path data
  const polygon = new window.google.maps.Polygon({ paths: polygonPath });
  const latLng = new window.google.maps.LatLng(markerPosition.lat, markerPosition.lng);

  // Use the built-in containsLocation method for a more robust check
  const result = window.google.maps.geometry.poly.containsLocation(latLng, polygon);
  
  return result;
}