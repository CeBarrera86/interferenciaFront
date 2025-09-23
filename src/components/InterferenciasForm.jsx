import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import FormEmpresas from './FormInterferencia/FormEmpresas';
import FormSolicitante from './FormInterferencia/FormSolicitante';
import FormObra from './FormInterferencia/FormObra';
import FormArchivos from './FormInterferencia/FormArchivos';
import FormBotones from './FormInterferencia/FormBotones';
import FormUbicacion from './FormInterferencia/FormUbicacion';
import Map from './MapComponent/Map';

import { useInterferenciaForm } from '../hooks/Interferencia/useInterferenciaForm';
import { useLocalidades } from '../hooks/Localidad/useLocalidades';

import MapPreviewDialog from './Dialogos/MapPreviewDialog';
import SuccessDialog from './Dialogos/SuccessDialog';
import ErrorDialog from './Dialogos/ErrorDialog';
import PreviewDialog from './Dialogos/PreviewDialog';

export default function InterferenciasForm() {
  const { localidades } = useLocalidades();
  const [imagenPreview, setImagenPreview] = useState(null);

  const form = useInterferenciaForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
    datosCapturaMapa,
    manejarCapturaMapa,
    limpiarCapturaMapa,
    onSubmit,
    abrirDialogoExito,
    mensajeExito,
    idInterferencia,
    abrirDialogoError,
    mensajeError,
    detallesError,
    cerrarDialogoError,
    resetearFormularioYMapa,
    abrirVistaPreviaMapa,
    cerrarVistaPreviaMapa,
    puedeCapturarMapa,
    tipoAdjuntoActivo,
    ubicaciones,
    agregarUbicacion,
    eliminarUbicacion,
    actualizarUbicacionDesdeMapa,
    pinActivoIndex,
    manejarCambioArchivoUbicacion,
    getValues,
    setValue,
  } = form;

  return (
    <Box sx={{ p: 2 }}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Panel Izquierdo */}
            <Box sx={{ flex: '1 1 500px' }}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">Registrar Nueva Interferencia</Typography>
                <FormEmpresas control={control} errors={errors} />
                <FormSolicitante control={control} errors={errors} />
                <FormObra control={control} errors={errors} />
                <FormArchivos
                  errors={errors}
                  onFilesChange={manejarCambioArchivoUbicacion}
                  onRemoveFile={(i) => {
                    const actuales = getValues('SOI_DOCUMENTO') || [];
                    const nuevos = actuales.filter((_, index) => index !== i);
                    setValue('SOI_DOCUMENTO', nuevos, { shouldDirty: true });
                  }}
                  onPreviewImage={setImagenPreview}
                />
              </Paper>
            </Box>

            {/* Panel Derecho */}
            <Box sx={{ flex: '1 1 500px' }}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">Zona de Interferencia</Typography>
                <Map
                  zoom={13.8}
                  ubicaciones={ubicaciones}
                  actualizarUbicacionDesdeMapa={actualizarUbicacionDesdeMapa}
                  onMapScreenshot={(img) => img ? manejarCapturaMapa(img) : limpiarCapturaMapa()}
                  pinActivoIndex={pinActivoIndex}
                  tipoAdjuntoActivo={tipoAdjuntoActivo}
                />
                {datosCapturaMapa && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">Captura actual:</Typography>
                    <img
                      src={datosCapturaMapa}
                      alt="Captura del mapa"
                      style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                  </Box>
                )}
                <FormUbicacion
                  control={control}
                  errors={errors}
                  localidades={localidades}
                  ubicaciones={ubicaciones}
                  onAddUbicacion={agregarUbicacion}
                  onRemoveUbicacion={eliminarUbicacion}
                />
              </Paper>
            </Box>
          </Box>

          <FormBotones />
        </form>
      </FormProvider>

      {/* Diálogos */}
      <MapPreviewDialog open={abrirVistaPreviaMapa} onClose={cerrarVistaPreviaMapa} mapScreenshotData={datosCapturaMapa} />
      <SuccessDialog open={abrirDialogoExito} onClose={resetearFormularioYMapa} message={mensajeExito} id={idInterferencia} />
      <ErrorDialog open={abrirDialogoError} onClose={cerrarDialogoError} message={mensajeError} details={detallesError} />
      <PreviewDialog open={!!imagenPreview} onClose={() => setImagenPreview(null)} imagen={imagenPreview} />
    </Box>
  );
}
