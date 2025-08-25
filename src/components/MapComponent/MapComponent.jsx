import React, { useRef, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import MapButton from './MapButton';
import { Maps_API_KEY, containerStyle, defaultCenter, libraries } from '../../config/mapConstants';
import { getMapOptions, getDrawingManagerOptions } from '../../config/mapOptions';
import { useMapMarker } from '../../hooks/useMapMarker';
import { useMapDrawing } from '../../hooks/useMapDrawing';
import { useMapScreenshot } from '../../hooks/useMapScreenshot';

const allLibraries = [...libraries, 'geometry', 'drawing'];

export default function MapComponent({
  zoom,
  onMapClick,
  markerPosition,
  onMapScreenshot,
  disableCaptureButton,
  onDrawnShapesChange
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: Maps_API_KEY,
    libraries: allLibraries,
  });

  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const captureButtonRef = useRef(null);
  const clearButtonRef = useRef(null);

  // Lógica del marcador (pin)
  const { currentMarker, handleMapClick, createOrUpdateMarker } = useMapMarker(
    mapRef,
    markerPosition || defaultCenter,
    isLoaded,
    onMapClick
  );

  // Lógica de dibujo
  const { onOverlayComplete, clearAllOverlays } = useMapDrawing(
    drawingManagerRef,
    isLoaded,
    onDrawnShapesChange
  );

  // Lógica de captura
  const { handleCaptureMap } = useMapScreenshot(
    mapContainerRef,
    mapRef,
    onMapScreenshot,
    disableCaptureButton,
    [captureButtonRef, clearButtonRef]
  );

  const onLoad = useCallback(
    function callback(map) {
      mapRef.current = map;
      createOrUpdateMarker();
      if (window.google.maps.drawing && !drawingManagerRef.current) {
        const drawingManager = new window.google.maps.drawing.DrawingManager(getDrawingManagerOptions());
        drawingManager.setMap(map);
        window.google.maps.event.addListener(drawingManager, 'overlaycomplete', onOverlayComplete);
        drawingManagerRef.current = drawingManager;
      }
    },
    [createOrUpdateMarker, onOverlayComplete]
  );

  const onUnmount = useCallback(function callback() {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setMap(null);
      drawingManagerRef.current = null;
    }
    mapRef.current = null;
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
          </GoogleMap>
          {/* Botones de acción */}
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              zIndex: 1000,
              display: 'flex',
              gap: '10px',
            }} >
            <MapButton ref={captureButtonRef} onClick={handleCaptureMap} disabled={disableCaptureButton} >
              Capturar Mapa
            </MapButton>
            <MapButton ref={clearButtonRef} onClick={clearAllOverlays} color="secondary" >
              Limpiar Dibujo
            </MapButton>
          </div>
        </div>
      </Grid>
    </Box>
  );
}