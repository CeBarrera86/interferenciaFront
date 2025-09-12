import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { Box, Grid, Tooltip } from '@mui/material';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import MapButton from './MapButton';
import { Maps_API_KEY, containerStyle, libraries } from '../../config/mapConstants';
import { posicionInicial } from '../../config/formConstants';
import { getMapOptions } from '../../config/mapOptions';
import { useMarkers } from '../../hooks/Mapa/useMarkers';
import { useScreenshot } from '../../hooks/Mapa/useScreenshot';
import { useDrawing } from '../../hooks/Mapa/useDrawing';
import { MapShapes } from './MapShapes';
import { corpicoColores as colores } from '../../config/mapConstants';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GestureIcon from '@mui/icons-material/Gesture';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const allLibraries = [...libraries, 'geometry', 'marker'];

export default function Map({
  zoom,
  ubicaciones,
  actualizarUbicacionDesdeMapa,
  onMapScreenshot,
  pinActivoIndex,
}) {
  const [mapReady, setMapReady] = useState(false);
  const [modoMapa, setModoMapa] = useState('movimiento');
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const captureButtonRef = useRef(null);
  const clearButtonRef = useRef(null);
  const drawButtonRef = useRef(null);
  const panButtonRef = useRef(null);
  const deleteCaptureButtonRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: Maps_API_KEY,
    libraries: allLibraries,
  });

  const { drawnShape, handleMapClickForDrawing, clearAllShapes, handleShapeChange } = useDrawing();

  const { moverPinActivo } = useMarkers(
    mapRef,
    ubicaciones,
    isLoaded && mapReady,
    actualizarUbicacionDesdeMapa,
    pinActivoIndex
  );

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (modoMapa === 'movimiento') {
      mapRef.current?.panTo({ lat, lng });
      actualizarUbicacionDesdeMapa(pinActivoIndex, lat, lng);
      moverPinActivo(lat, lng);
    } else if (modoMapa === 'dibujo') {
      handleMapClickForDrawing(event);
    }
  }, [modoMapa, actualizarUbicacionDesdeMapa, handleMapClickForDrawing, pinActivoIndex, moverPinActivo]);

  useEffect(() => {
    if (drawnShape?.type === 'polygon') {
      actualizarUbicacionDesdeMapa(pinActivoIndex, ubicaciones[pinActivoIndex]?.USI_LATITUD, ubicaciones[pinActivoIndex]?.USI_LONGITUD);
    }
  }, [drawnShape, actualizarUbicacionDesdeMapa, pinActivoIndex, ubicaciones]);

  const mapCenter = useMemo(() => {
    const first = ubicaciones?.[0];
    return first ? { lat: first.USI_LATITUD, lng: first.USI_LONGITUD } : posicionInicial;
  }, [ubicaciones]);

  const { handleCaptureMap } = useScreenshot(
    mapContainerRef,
    mapRef,
    onMapScreenshot,
    false,
    [captureButtonRef, clearButtonRef, drawButtonRef, panButtonRef, deleteCaptureButtonRef]
  );

  const handleShapeEdit = useCallback(() => {}, []);

  if (loadError) return <div>Error cargando Google Maps</div>;
  if (!isLoaded) return <div>Cargando Mapa...</div>;

  return (
    <Box sx={{ mb: 2, mt: 2, position: 'relative' }}>
      <Grid size={{ xs: 12 }}>
        <div ref={mapContainerRef} style={containerStyle}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom || 13}
            onLoad={(map) => { mapRef.current = map; setMapReady(true); }}
            onUnmount={() => { mapRef.current = null; setMapReady(false); }}
            onClick={handleMapClick}
            options={{ ...getMapOptions(), disableDoubleClickZoom: true }}
          >
            {drawnShape?.type === 'polygon' && (
              <Polygon
                paths={drawnShape.path}
                options={{
                  fillColor: colores[2],
                  fillOpacity: 0.2,
                  strokeWeight: 1,
                  editable: true,
                }}
                onMouseUp={handleShapeChange}
              />
            )}
            <MapShapes ubicaciones={ubicaciones} onShapeEdit={handleShapeEdit} />
          </GoogleMap>

          {/* Botones */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, display: 'flex', gap: '10px' }}>
            <Tooltip title="Ubicar Marcador">
              <MapButton
                color="primary"
                onClick={() => setModoMapa('movimiento')}
                selected={modoMapa === 'movimiento'}
                ref={panButtonRef}
              >
                <LocationOnIcon />
              </MapButton>
            </Tooltip>

            <Tooltip title="Dibujar Zona">
              <MapButton
                color="primary"
                onClick={() => setModoMapa('dibujo')}
                selected={modoMapa === 'dibujo'}
                ref={drawButtonRef}
              >
                <GestureIcon />
              </MapButton>
            </Tooltip>

            <Tooltip title="Eliminar Zona">
              <MapButton
                color="primary"
                onClick={() => {
                  clearAllShapes();
                  actualizarUbicacionDesdeMapa(pinActivoIndex, ubicaciones[pinActivoIndex]?.USI_LATITUD, ubicaciones[pinActivoIndex]?.USI_LONGITUD);
                }}
                ref={clearButtonRef}
              >
                <DeleteIcon />
              </MapButton>
            </Tooltip>

            <Tooltip title="Capturar Mapa">
              <MapButton color="primary" ref={captureButtonRef} onClick={handleCaptureMap}>
                <CameraAltIcon />
              </MapButton>
            </Tooltip>

            <Tooltip title="Eliminar Captura de Mapa">
              <MapButton color="primary" onClick={() => onMapScreenshot(null)} ref={deleteCaptureButtonRef}>
                <ImageNotSupportedIcon />
              </MapButton>
            </Tooltip>
          </div>
        </div>
      </Grid>
    </Box>
  );
}