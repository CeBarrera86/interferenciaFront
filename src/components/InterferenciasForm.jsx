import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import FormServicios from './FormInterferencia/FormServicios';
import FormSolicitante from './FormInterferencia/FormSolicitante';
import FormFechas from './FormInterferencia/FormFechas';
import FormUbicacion from './FormInterferencia/FormUbicacion';
import FormBotones from './FormInterferencia/FormBotones';
import MapComponent from './MapComponent/MapComponent';
import FormArchivos from './FormInterferencia/FormArchivos';
import { useLocalidades } from '../hooks/useLocalidades';
import { useInterferenciaForm } from '../hooks/useInterferenciaForm';
import MapPreviewDialog from './Dialogos/MapPreviewDialog';
import SuccessDialog from './Dialogos/SuccessDialog';
import ErrorDialog from './Dialogos/ErrorDialog';

export default function InterferenciasForm() {
  const { localidades } = useLocalidades();
  const {
    control,
    handleSubmit,
    errors,
    latitudActual,
    longitudActual,
    adjuntoExistente,
    datosCapturaMapa,
    abrirVistaPreviaMapa,
    tipoAdjuntoActivo,
    manejarCapturaMapa,
    manejarCambioArchivoUbicacion,
    cerrarVistaPreviaMapa,
    manejarClickMapa,
    limpiarAdjunto,
    onSubmit,
    abrirDialogoExito,
    mensajeExito,
    idInterferencia,
    resetearFormularioYMapa,
    abrirDialogoError,
    mensajeError,
    detallesError,
    cerrarDialogoError,
    setFormasDibujadas,
    puedeCapturarMapa,
    ubicaciones,
    agregarUbicacion,
    eliminarUbicacion,
  } = useInterferenciaForm();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Panel Izquierdo */}
        <Box sx={{ flex: '1 1 500px' }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Registrar Nueva Interferencia</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormServicios control={control} errors={errors} />
              <FormSolicitante control={control} errors={errors} />
              <FormFechas control={control} errors={errors} />
              {/* 🚨 Itera sobre el array de 'ubicaciones' en lugar de 'fields' */}
              {ubicaciones.map((ubicacion, index) => (
                <FormUbicacion
                  key={ubicacion.id}
                  control={control}
                  errors={errors}
                  localidades={localidades}
                  index={index}
                  append={agregarUbicacion}
                  remove={eliminarUbicacion}
                  totalForms={ubicaciones.length}
                  isRemovable={ubicaciones.length > 1}
                  isLast={index === ubicaciones.length - 1}
                />
              ))}
              <FormBotones />
            </form>
          </Paper>
        </Box>
        {/* Panel Derecho */}
        <Box sx={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Zona de Interferencia</Typography>
            <MapComponent
              center={{ lat: latitudActual, lng: longitudActual }}
              zoom={13}
              onMapClick={manejarClickMapa}
              markerPosition={{ lat: latitudActual, lng: longitudActual }}
              onMapScreenshot={manejarCapturaMapa}
              disableCaptureButton={!puedeCapturarMapa || tipoAdjuntoActivo === 'file'}
              onDrawnShapesChange={setFormasDibujadas}
            />
          {/* </Paper>
          <Paper elevation={3} sx={{ p: 2 }}> */}
            <FormArchivos
              control={control}
              errors={errors}
              onFileChange={manejarCambioArchivoUbicacion}
              isFileUploadDisabled={tipoAdjuntoActivo === 'map'}
              mapScreenshotActive={tipoAdjuntoActivo === 'map'}
              currentAdjunto={adjuntoExistente}
              onClearAttachment={limpiarAdjunto}
            />
          </Paper>
        </Box>
      </Box>
      {/* Diálogos */}
      <MapPreviewDialog open={abrirVistaPreviaMapa} onClose={cerrarVistaPreviaMapa} mapScreenshotData={datosCapturaMapa} />
      <SuccessDialog open={abrirDialogoExito} onClose={resetearFormularioYMapa} message={mensajeExito} id={idInterferencia} />
      <ErrorDialog open={abrirDialogoError} onClose={cerrarDialogoError} message={mensajeError} details={detallesError} />
    </Box>
  );
}
