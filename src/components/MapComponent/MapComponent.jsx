import React, { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DrawingManager } from '@react-google-maps/api';
import { Maps_API_KEY, Maps_ID, containerStyle, defaultCenter, libraries } from '../../config/mapConstants';
import { getMapOptions } from '../../config/mapOptions';
import MapButton from './MapButton';
import { useMapMarker } from '../../hooks/useMapMarker';
import { useMapDrawing } from '../../hooks/useMapDrawing';
import { useMapScreenshot } from '../../hooks/useMapScreenshot';

export default function MapComponent({ zoom, onMapClick, markerPosition, onMapScreenshot, disableCaptureButton }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: Maps_API_KEY,
    libraries,
  });

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const captureButtonRef = useRef(null);
  const clearButtonRef = useRef(null);
  const { currentMarker, handleMapClick, createOrUpdateMarker } = useMapMarker(mapRef, markerPosition || defaultCenter, isLoaded, onMapClick);
  const { drawingManagerRef, onDrawingManagerLoad, onOverlayComplete, drawingManagerOptions, clearAllOverlays } = useMapDrawing(isLoaded);
  const { handleCaptureMap } = useMapScreenshot(
    mapContainerRef,
    mapRef,
    onMapScreenshot,
    disableCaptureButton,
    [captureButtonRef, clearButtonRef]
  );

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