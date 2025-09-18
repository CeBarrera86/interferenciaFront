import { useState, useMemo, useEffect } from 'react';
import { isMarkerInsidePolygon } from '../../utils/mapUtils';

/**
 * Hook para validar si los pines están dentro de un polígono.
 * @param {Array<{USI_LATITUD: number, USI_LONGITUD: number}>} ubicaciones - Lista de pines.
 * @param {Object} drawnShape - El polígono dibujado.
 * @returns {Object} - puedeCapturar, pinesInvalidos
 */
export function useValidarZona(ubicaciones, drawnShape) {
  const [puedeCapturar, setPuedeCapturar] = useState(false);
  const [pinesInvalidos, setPinesInvalidos] = useState([]);

  useEffect(() => {
    const hayPines = Array.isArray(ubicaciones) && ubicaciones.length > 0;
    const hayPoligono = drawnShape?.type === 'polygon';

    if (!hayPines) {
      console.log('❌ No hay pines para validar');
      setPuedeCapturar(false);
      setPinesInvalidos([]);
      return;
    }

    if (!hayPoligono || !drawnShape.path || drawnShape.path.length < 3) {
      console.log('⚠️ Polígono inválido o incompleto');
      setPuedeCapturar(true);
      setPinesInvalidos([]);
      return;
    }

    const invalidos = ubicaciones.filter(
      (ubi) => !isMarkerInsidePolygon({ lat: ubi.USI_LATITUD, lng: ubi.USI_LONGITUD }, drawnShape.path)
    );

    const resultado = invalidos.length === 0;

    console.log('✅ puedeCapturar:', resultado);
    console.log('📌 Pines inválidos:', invalidos);
    
    setPuedeCapturar(resultado);
    setPinesInvalidos(invalidos);
  }, [ubicaciones, drawnShape]);

  return { puedeCapturar, pinesInvalidos };
}