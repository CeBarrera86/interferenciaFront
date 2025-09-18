import React, { useRef, useCallback, useState, useMemo } from 'react';
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
import { useValidarZona } from '../../hooks/Mapa/useValidarZona';

const allLibraries = [...libraries, 'geometry', 'marker'];

export default function Map({
  zoom,
  ubicaciones,
  actualizarUbicacionDesdeMapa,
  onMapScreenshot,
  pinActivoIndex,
  tipoAdjuntoActivo,
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
  const polygonRef = useRef(null);
  const { drawnShape, setDrawnShape, handleMapClickForDrawing, clearAllShapes } = useDrawing();
  const { moverPinActivo } = useMarkers(
    mapRef,
    ubicaciones,
    mapReady,
    actualizarUbicacionDesdeMapa,
    pinActivoIndex
  );

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: Maps_API_KEY,
    libraries: allLibraries,
  });

  const mapCenter = useMemo(() => {
    const first = ubicaciones?.[0];
    return first ? { lat: first.USI_LATITUD, lng: first.USI_LONGITUD } : posicionInicial;
  }, [ubicaciones]);

  const { handleCaptureMap } = useScreenshot(
    mapContainerRef,
    mapRef,
    (img) => {
      console.log('📸 Captura de mapa generada');
      onMapScreenshot(img);
    },
    false,
    [captureButtonRef, clearButtonRef, drawButtonRef, panButtonRef, deleteCaptureButtonRef]
  );

  const { puedeCapturar, pinesInvalidos } = useValidarZona( ubicaciones, drawnShape );

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log(`🖱️ Click en el mapa: (${lat}, ${lng})`);

    if (modoMapa === 'movimiento') {
      console.log('📍 Modo movimiento: actualizando ubicación del pin activo');
      mapRef.current?.panTo({ lat, lng });
      actualizarUbicacionDesdeMapa(pinActivoIndex, lat, lng); // Directly call the prop
      moverPinActivo(lat, lng);
    } else if (modoMapa === 'dibujo') {
      console.log('✏️ Modo dibujo: agregando punto al polígono');
      handleMapClickForDrawing(event);
    }
  }, [modoMapa, actualizarUbicacionDesdeMapa, handleMapClickForDrawing, pinActivoIndex, moverPinActivo]);

  const onPolygonEdit = useCallback(() => {
    if (polygonRef.current) {
      const path = polygonRef.current.getPath();
      if (path && typeof path.getArray === 'function') {
        const newPath = path.getArray().map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));
        setDrawnShape({ type: 'polygon', path: newPath });
        console.log('✏️ Polígono editado. Nuevo path:', newPath);
      }
    }
  }, [setDrawnShape]);

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
            onLoad={(map) => {
              console.log('🗺️ Mapa cargado');
              mapRef.current = map;
              setMapReady(true);
            }}
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
                  clickable: false,
                  zIndex: 1,
                }}
                onLoad={(polygon) => {
                  polygonRef.current = polygon;
                  console.log('🔺 Polígono cargado y editable. Referencia guardada.');
                }}
                onMouseUp={onPolygonEdit}
              />
            )}
            <MapShapes ubicaciones={ubicaciones} onShapeEdit={() => {}} />
          </GoogleMap>

          {/* Botones */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, display: 'flex', gap: '10px' }}>
            <Tooltip title="Ubicar Marcador">
              <MapButton color="primary" onClick={() => setModoMapa('movimiento')} selected={modoMapa === 'movimiento'} ref={panButtonRef}>
                <LocationOnIcon />
              </MapButton>
            </Tooltip>

            <Tooltip title="Dibujar Zona">
              <MapButton color="primary" onClick={() => setModoMapa('dibujo')} selected={modoMapa === 'dibujo'} ref={drawButtonRef}>
                <GestureIcon />
              </MapButton>
            </Tooltip>

            <Tooltip title="Eliminar Zona">
              <MapButton color="primary" onClick={() => { clearAllShapes(); }} ref={clearButtonRef} >
                <DeleteIcon />
              </MapButton>
            </Tooltip>

            <Tooltip title={!puedeCapturar ? 'Los pines deben estar dentro del área dibujada' : 'Capturar Mapa'}>
              <span>
                <MapButton color="primary" ref={captureButtonRef} onClick={handleCaptureMap} disabled={!puedeCapturar || tipoAdjuntoActivo === 'file'} >
                  <CameraAltIcon />
                </MapButton>
              </span>
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