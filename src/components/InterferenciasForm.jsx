import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
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

export default function InterferenciasForm() {
  const { localidades } = useLocalidades();
  const {
    control,
    handleSubmit,
    formState: { errors },
    adjuntoMapa,
    adjuntoDocumento,
    datosCapturaMapa,
    abrirVistaPreviaMapa,
    manejarCapturaMapa,
    manejarCambioArchivoUbicacion,
    cerrarVistaPreviaMapa,
    limpiarAdjunto,
    onSubmit,
    abrirDialogoExito,
    mensajeExito,
    idInterferencia,
    abrirDialogoError,
    mensajeError,
    detallesError,
    cerrarDialogoError,
    resetearFormularioYMapa,
    puedeCapturarMapa,
    tipoAdjuntoActivo,
    ubicaciones,
    agregarUbicacion,
    eliminarUbicacion,
    actualizarUbicacionDesdeMapa,
    pinActivoIndex,
  } = useInterferenciaForm();

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Panel Izquierdo */}
          <Box sx={{ flex: '1 1 500px' }}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6">Registrar Nueva Interferencia</Typography>
              <FormEmpresas control={control} errors={errors} />
              <FormSolicitante control={control} errors={errors} />
              <FormObra control={control} errors={errors} />
              <FormArchivos
                control={control}
                errors={errors}
                onFileChange={manejarCambioArchivoUbicacion}
                isFileUploadDisabled={false}
                mapScreenshotActive={!!adjuntoMapa}
                currentAdjunto={adjuntoDocumento}
                onClearAttachment={limpiarAdjunto}
              />
            </Paper>
          </Box>

          {/* Panel Derecho */}
          <Box sx={{ flex: '1 1 500px' }}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6">Zona de Interferencia</Typography>
              <Map
                zoom={13.8}
                ubicaciones={ubicaciones}
                onMapScreenshot={manejarCapturaMapa}
                disableCaptureButton={!puedeCapturarMapa || tipoAdjuntoActivo === 'file'}
                actualizarUbicacionDesdeMapa={actualizarUbicacionDesdeMapa}
                pinActivoIndex={pinActivoIndex}
              />
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

      {/* Diálogos */}
      <MapPreviewDialog
        open={abrirVistaPreviaMapa}
        onClose={cerrarVistaPreviaMapa}
        mapScreenshotData={datosCapturaMapa}
      />
      <SuccessDialog
        open={abrirDialogoExito}
        onClose={resetearFormularioYMapa}
        message={mensajeExito}
        id={idInterferencia}
      />
      <ErrorDialog
        open={abrirDialogoError}
        onClose={cerrarDialogoError}
        message={mensajeError}
        details={detallesError}
      />
    </Box>
  );
}