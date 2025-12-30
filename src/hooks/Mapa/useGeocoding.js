export function useGeocoding() {
  // Crea un geocoder bajo demanda evitando dependencias que accedan a `window` en tiempo de render
  const createGeocoder = () => {
    if (typeof window === 'undefined' || !window.google || !window.google.maps || !window.google.maps.Geocoder) {
      return null;
    }
    return new window.google.maps.Geocoder();
  };

  const obtenerDireccionDesdeCoordenadas = async (lat, lng) => {
    const geocoder = createGeocoder();
    if (!geocoder) return { calle: '', altura: '', localidadNombre: '', vereda: '' };

    return new Promise((resolve) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status !== 'OK' || !results?.length) return resolve({ calle: '', altura: '', localidadNombre: '', vereda: '' });

        const comps = results[0].address_components;
        const calle = comps.find(c => c.types.includes('route'))?.long_name || '';
        const alturaStr = comps.find(c => c.types.includes('street_number'))?.long_name || '';

        const localidadNombre = comps.find(c =>
          c.types.includes('locality') || c.types.includes('administrative_area_level_2')
        )?.long_name || '';

        const alturaNum = parseInt(alturaStr, 10);
        const vereda = (alturaNum > 0 && alturaNum % 2 === 0) ? 'P' :
          (alturaNum > 0 && alturaNum % 2 !== 0) ? 'I' : '';

        resolve({ calle, altura: alturaStr, localidadNombre, vereda });
      });
    });
  };

  const obtenerCoordenadasDesdeDireccion = async (direccionCompleta) => {
    const geocoder = createGeocoder();
    if (!geocoder) return null;

    return new Promise((resolve) => {
      geocoder.geocode({ address: direccionCompleta }, (results, status) => {
        if (status !== 'OK' || !results?.length) return resolve(null);
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      });
    });
  };

  return { obtenerDireccionDesdeCoordenadas, obtenerCoordenadasDesdeDireccion };
}