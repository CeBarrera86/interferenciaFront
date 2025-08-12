import React, { useRef, useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { GoogleMap, useJsApiLoader, DrawingManager } from '@react-google-maps/api';
import { Maps_API_KEY, containerStyle, defaultCenter, libraries } from '../../config/mapConstants';
import { getMapOptions } from '../../config/mapOptions';
import MapButton from './MapButton';
import { useMapMarker } from '../../hooks/useMapMarker';
import { useMapDrawing } from '../../hooks/useMapDrawing';
import html2canvas from 'html2canvas';

// Se carga la librería 'geometry' adicionalmente a las ya existentes
const allLibraries = [...libraries, 'geometry'];

export default function MapComponent({ zoom, onMapClick, markerPosition, onMapScreenshot, disableCaptureButton, onDrawnShapesChange }) {
  // Hook de Google Maps para cargar la API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: Maps_API_KEY,
    libraries: allLibraries,
  });

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const captureButtonRef = useRef(null);
  const clearButtonRef = useRef(null);

  // Lógica del marcador (pin) encapsulada en un hook
  const { currentMarker, handleMapClick, createOrUpdateMarker } = useMapMarker(mapRef, markerPosition || defaultCenter, isLoaded, onMapClick);

  // Lógica de dibujo de formas en el mapa encapsulada en un hook
  const { drawingManagerRef, onDrawingManagerLoad, onOverlayComplete, drawnShapes, drawingManagerOptions, clearAllOverlays } = useMapDrawing(isLoaded, onDrawnShapesChange);

  // Lógica de captura del mapa usando html2canvas
  const handleCaptureMap = useCallback(() => {
    if (mapContainerRef.current && onMapScreenshot) {
      // Ocultar los botones temporalmente para que no aparezcan en la captura
      if (captureButtonRef.current) captureButtonRef.current.style.visibility = 'hidden';
      if (clearButtonRef.current) clearButtonRef.current.style.visibility = 'hidden';

      html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        onMapScreenshot(canvas.toDataURL('image/png'));
      }).catch(err => {
        console.error("Error al capturar el mapa:", err);
      }).finally(() => {
        // Volver a mostrar los botones
        if (captureButtonRef.current) captureButtonRef.current.style.visibility = 'visible';
        if (clearButtonRef.current) clearButtonRef.current.style.visibility = 'visible';
      });
    } else {
      console.warn("No se pudo capturar el mapa: mapContainerRef no disponible o onMapScreenshot no definido.");
    }
  }, [onMapScreenshot]);

  // Callback que se ejecuta cuando el mapa se carga
  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
    // Si hay una posición de marcador definida, centrar el mapa en ella
    if (markerPosition && (markerPosition.lat !== defaultCenter.lat || markerPosition.lng !== defaultCenter.lng)) {
      map.setCenter(markerPosition);
    } else {
      map.setCenter(defaultCenter);
    }
    map.setZoom(zoom || 13);

    if (isLoaded) {
      createOrUpdateMarker();
    }
  }, [markerPosition, zoom, isLoaded, createOrUpdateMarker]);

  // Callback que se ejecuta cuando el mapa se desmonta
  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
    drawingManagerRef.current = null;
  }, []);

  if (loadError) return <div>Error cargando Google Maps</div>;
  if (!isLoaded) return <div>Cargando Mapa...</div>;

  return (
    <Box sx={{ mb: 2, mt: 2, position: 'relative' }}>
      <Grid size={{ xs: 12 }}>
        <div ref={mapContainerRef} style={containerStyle}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentMarker}
            zoom={zoom || 13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={getMapOptions()}
          >
            {drawingManagerOptions && (
              <DrawingManager
                onLoad={onDrawingManagerLoad}
                onOverlayComplete={onOverlayComplete}
                options={drawingManagerOptions}
              />
            )}
          </GoogleMap>

          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 1000,
            display: 'flex',
            gap: '10px'
          }}>
            <MapButton ref={captureButtonRef} onClick={handleCaptureMap} disabled={disableCaptureButton}>
              Capturar Mapa
            </MapButton>
            <MapButton ref={clearButtonRef} onClick={clearAllOverlays} color="secondary">
              Borrar Dibujo
            </MapButton>
          </div>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Cómo usar el mapa:
        </Typography>
        <Typography variant="body2" component="p" >
          • Para ubicar el punto exacto de la interferencia, puedes hacer **clic en cualquier lugar del mapa**. Puedes usar zoom.
        </Typography>
        <Typography variant="body2" component="p" >
          • Si se necesita delimitar un área específica, utiliza la herramienta de dibujo en el mapa. Si hay un área dibujada, **el pin debe estar obligatoriamente dentro de esa zona** para poder enviar el formulario.
        </Typography>
        <Typography variant="body2" component="p" >
          • El formulario solo permite adjuntar **un tipo de evidencia**: o bien un archivo externo (como un PDF o una foto) o bien una captura del mapa.
        </Typography>
      </Grid>
    </Box>
  );
}
