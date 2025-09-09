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
 * Verifica si un punto geográfico se encuentra dentro de una forma geométrica dibujada en el mapa.
 * Soporta polígonos, rectángulos y círculos.
 * @param {{lat: number, lng: number}} punto - El punto a verificar.
 * @param {{type: 'polygon'|'rectangle'|'circle', googleObject: any}} forma - La forma de Google Maps (con su objeto) a usar para la verificación.
 * @returns {boolean} - true si el punto está dentro de la forma, de lo contrario false.
 */
export const esPuntoEnForma = (punto, forma) => {
  if (!window.google || !window.google.maps || !window.google.maps.geometry) {
    console.warn("La API de Google Maps (o la librería geometry) no está cargada para esPuntoEnForma.");
    return false;
  }
  const puntoGoogle = new window.google.maps.LatLng(punto.lat, punto.lng);

  if (forma.type === 'polygon' && forma.googleObject) {
    return window.google.maps.geometry.poly.containsLocation(puntoGoogle, forma.googleObject);
  } else if (forma.type === 'rectangle' && forma.googleObject) {
    return forma.googleObject.getBounds().contains(puntoGoogle);
  } else if (forma.type === 'circle' && forma.googleObject) {
    const centro = forma.googleObject.getCenter();
    const radio = forma.googleObject.getRadius();
    const distancia = window.google.maps.geometry.spherical.computeDistanceBetween(puntoGoogle, centro);
    return distancia <= radio;
  }
  return false;
};

/**
 * Verifica si un punto está dentro de un polígono definido por un array de coordenadas [{lat, lng}]
 * @param {{lat: number, lng: number}} punto - Punto a verificar
 * @param {Array<{lat: number, lng: number}>} path - Array de coordenadas del polígono
 * @returns {boolean}
 */
export const isMarkerInsidePolygon = (punto, path) => {
  if (!window.google || !window.google.maps || !window.google.maps.geometry) {
    console.warn("Google Maps geometry no disponible.");
    return false;
  }

  const latLng = new window.google.maps.LatLng(punto.lat, punto.lng);
  const polygon = new window.google.maps.Polygon({ paths: path });

  return window.google.maps.geometry.poly.containsLocation(latLng, polygon);
};