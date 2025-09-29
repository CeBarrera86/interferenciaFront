import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { interferenciaSchema } from '../../validation/interferenciaSchema';
import { useArchivos } from './useArchivos';
import { useDialogos } from './useDialogos';
import { useEnvioInterferencia } from './useEnvioInterferencia';
import { ubicacionBase, formularioInicial } from '../../config/formConstants';
import { useGeocoding } from '../Mapa/useGeocoding';

export function useInterferenciaForm(localidades) {
  const form = useForm({ resolver: yupResolver(interferenciaSchema), defaultValues: formularioInicial, });
  const { control, setValue, getValues, watch, ...restForm } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'SOI_UBICACIONES' });
  const [pinActivoIndex, setPinActivoIndex] = useState(0);
  const { obtenerCoordenadasDesdeDireccion } = useGeocoding();
  const actualizarUbicacionDesdeMapa = useCallback((index, lat, lng, calle = null, altura = null, localidadNombre = null, vereda = null) => {
    const ubicaciones = getValues('SOI_UBICACIONES');

    if (!ubicaciones[index]) {
      console.warn(`❌ Índice ${index} fuera de rango. No se actualiza ubicación.`);
      return;
    }

    // 1. Actualizar coordenadas, calle y altura
    setValue(`SOI_UBICACIONES.${index}.USI_LATITUD`, lat);
    setValue(`SOI_UBICACIONES.${index}.USI_LONGITUD`, lng);

    if (calle !== null) setValue(`SOI_UBICACIONES.${index}.USI_CALLE`, calle);
    if (altura !== null) setValue(`SOI_UBICACIONES.${index}.USI_ALTURA`, altura);

    // 2. Mapear nombre de localidad a ID y actualizar
    if (localidadNombre && localidades) {
      const loc = localidades.find(l => l.nombre.toLowerCase() === localidadNombre.toLowerCase());
      if (loc) {
        setValue(`SOI_UBICACIONES.${index}.USI_LOCALIDAD_ID`, loc.id);
      } else {
        console.warn(`Localidad '${localidadNombre}' no encontrada en la lista.`);
      }
    }

    // 3. Actualizar Vereda (Par/Impar)
    if (vereda !== null) {
      setValue(`SOI_UBICACIONES.${index}.USI_VEREDA`, vereda);
    }

    const actualizadas = ubicaciones.map((ubi) => ({ ...ubi }));
    setValue('SOI_UBICACIONES', actualizadas);
    setPinActivoIndex(index);
  }, [getValues, setValue, localidades]);

  const agregarUbicacion = () => {
    append({ ...ubicacionBase });
    setPinActivoIndex(getValues('SOI_UBICACIONES').length - 1);
  };

  const eliminarUbicacion = (index) => {
    remove(index);

    const nuevasUbicaciones = getValues('SOI_UBICACIONES');
    const nuevoIndex = Math.min(index > 0 ? index - 1 : 0, nuevasUbicaciones.length - 1);

    setPinActivoIndex(nuevoIndex);
  };

  const manejarCambioDireccion = useCallback(async (index) => {
    const ubicacion = getValues(`SOI_UBICACIONES.${index}`);

    let calleParaBusqueda = ubicacion.USI_CALLE.trim();
    const esCalleNumerica = /^\d+$/.test(calleParaBusqueda.replace(/\s/g, ''));

    if (esCalleNumerica) {
      calleParaBusqueda = `Calle ${calleParaBusqueda}`;
    }

    const localidadSeleccionada = localidades?.find(
      (loc) => loc.id === ubicacion.USI_LOCALIDAD_ID
    )?.nombre;

    const direccionBase = `${calleParaBusqueda} ${ubicacion.USI_ALTURA}`;
    const direccionCompleta = localidadSeleccionada ?
      `${direccionBase}, ${localidadSeleccionada}` : direccionBase;

    if (ubicacion.USI_CALLE && ubicacion.USI_ALTURA && localidadSeleccionada) {

      console.log(`Buscando coordenadas para: ${direccionCompleta}`);
      const coords = await obtenerCoordenadasDesdeDireccion(direccionCompleta);

      if (coords) {
        actualizarUbicacionDesdeMapa(
          index,
          coords.lat,
          coords.lng,
          ubicacion.USI_CALLE,
          ubicacion.USI_ALTURA,
          localidadSeleccionada
        );
      } else {
        console.warn(`❌ Dirección no encontrada: ${direccionCompleta}`);
      }
    } else {
      console.warn('⚠️ Faltan datos (Calle, Altura o Localidad) para geocodificar. Omite la búsqueda.');
    }
  }, [getValues, obtenerCoordenadasDesdeDireccion, actualizarUbicacionDesdeMapa, localidades]);

  const archivos = useArchivos(form);
  const dialogos = useDialogos(form);
  const envio = useEnvioInterferencia(form, dialogos);
  const ubicaciones = watch('SOI_UBICACIONES');

  return {
    control,
    setValue,
    getValues,
    watch,
    ...restForm,
    ubicaciones,
    agregarUbicacion,
    eliminarUbicacion,
    actualizarUbicacionDesdeMapa,
    manejarCambioDireccion,
    pinActivoIndex,
    setPinActivoIndex,
    ...archivos,
    ...dialogos,
    ...envio,
  };
}