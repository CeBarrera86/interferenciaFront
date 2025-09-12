import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { interferenciasSchema } from '../../validation/interferenciasSchema';
import { useArchivos } from './useArchivos';
import { useDialogos } from './useDialogos';
import { useEnvioInterferencia } from './useEnvioInterferencia';
import { ubicacionBase, formularioInicial } from '../../config/formConstants';

export function useInterferenciaForm() {
  const form = useForm({
    resolver: yupResolver(interferenciasSchema),
    defaultValues: formularioInicial,
  });

  const {
    control,
    setValue,
    getValues,
    watch,
    ...restForm
  } = form;

  const {
    fields: ubicaciones,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'SOI_UBICACIONES',
  });

  const archivos = useArchivos(form, (newUbicaciones) => {
    newUbicaciones.forEach((ubi, index) => {
      setValue(`SOI_UBICACIONES.${index}`, ubi);
    });
  });

  const dialogos = useDialogos(form);
  const envio = useEnvioInterferencia(form, dialogos);

  const [pinActivoIndex, setPinActivoIndex] = useState(0);

  const actualizarUbicacionDesdeMapa = (index, lat, lng) => {
    setValue(`SOI_UBICACIONES.${index}.USI_LATITUD`, lat);
    setValue(`SOI_UBICACIONES.${index}.USI_LONGITUD`, lng);
    setPinActivoIndex(index);
  };

  const agregarUbicacion = () => {
    append({ ...ubicacionBase });
    setPinActivoIndex(ubicaciones.length); // nuevo índice
  };

  const eliminarUbicacion = (index) => {
    remove(index);
    setPinActivoIndex((prev) => (prev === index ? 0 : Math.max(0, prev - 1)));
  };

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
    pinActivoIndex,
    ...archivos,
    ...dialogos,
    ...envio,
  };
} 