import React, { useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DrawingManager } from '@react-google-maps/api';
import { Maps_API_KEY, containerStyle, defaultCenter, libraries } from '../../config/mapConstants';
import { getMapOptions } from '../../config/mapOptions';
import MapButton from './MapButton';
import { useMapMarker } from '../../hooks/useMapMarker';
import { useMapDrawing } from '../../hooks/useMapDrawing';
import html2canvas from 'html2canvas';

const allLibraries = [...libraries, 'geometry'];

export default function MapComponent({ zoom, onMapClick, markerPosition, onMapScreenshot, disableCaptureButton, onDrawnShapesChange }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: Maps_API_KEY,
    libraries: allLibraries,
  });
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const captureButtonRef = useRef(null);
  const clearButtonRef = useRef(null);
  const { currentMarker, handleMapClick, createOrUpdateMarker } = useMapMarker(mapRef, markerPosition || defaultCenter, isLoaded, onMapClick);
  const { drawingManagerRef, onDrawingManagerLoad, onOverlayComplete, drawnShapes, drawingManagerOptions, clearAllOverlays } = useMapDrawing(isLoaded, onDrawnShapesChange);
  // Lógica de captura de mapa con html2canvas
  const handleCaptureMap = useCallback(() => {
    if (mapContainerRef.current && onMapScreenshot) {
      html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        onMapScreenshot(canvas.toDataURL('image/png'));
      }).catch(err => {
        console.error("Error al capturar el mapa:", err);
      });
    } else {
      console.warn("No se pudo capturar el mapa: mapContainerRef no disponible o onMapScreenshot no definido.");
    }
  }, [onMapScreenshot]);

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
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

  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
    drawingManagerRef.current = null;
  }, []);

  if (loadError) return <div>Error cargando Google Maps</div>;
  if (!isLoaded) return <div>Cargando Mapa...</div>;

  return (
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
  );
}