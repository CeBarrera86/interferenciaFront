import { useMemo } from 'react';

export function useGeocoding() {

  const geocoder = useMemo(() => {
    // Si no está cargado o no existe el objeto Geocoder, retorna null
    if (typeof window === 'undefined' || !window.google || !window.google.maps || !window.google.maps.Geocoder) {
      return null;
    }
    // Si ya existe, inicializa el Geocoder
    return new window.google.maps.Geocoder();
  }, [window.google?.maps?.Geocoder]);

  const obtenerDireccionDesdeCoordenadas = async (lat, lng) => {
    // Si el geocoder es null (falla de inicialización), retorna vacío
    if (!geocoder) return { calle: '', altura: '', localidadNombre: '', vereda: '' };

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== 'OK' || !results?.length) return resolve({ calle: '', altura: '', localidadNombre: '', vereda: '' });

        const comps = results[0].address_components;
        const calle = comps.find(c => c.types.includes('route'))?.long_name || '';
        const alturaStr = comps.find(c => c.types.includes('street_number'))?.long_name || '';

        // Extraer nombre de la localidad/ciudad
        const localidadNombre = comps.find(c =>
          c.types.includes('locality') || c.types.includes('administrative_area_level_2')
        )?.long_name || '';

        // Determinar Vereda: Par ('P') / Impar ('I')
        const alturaNum = parseInt(alturaStr, 10);
        const vereda = (alturaNum > 0 && alturaNum % 2 === 0) ? 'P' :
          (alturaNum > 0 && alturaNum % 2 !== 0) ? 'I' : '';

        resolve({ calle, altura: alturaStr, localidadNombre, vereda });
      });
    });
  };

  const obtenerCoordenadasDesdeDireccion = async (direccionCompleta) => {
    if (!geocoder) return null;

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: direccionCompleta }, (results, status) => {
        if (status !== 'OK' || !results?.length) return resolve(null);
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      });
    });
  };

  return { obtenerDireccionDesdeCoordenadas, obtenerCoordenadasDesdeDireccion };
}