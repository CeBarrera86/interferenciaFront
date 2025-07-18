import React, { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DrawingManager } from '@react-google-maps/api';
import { Maps_API_KEY, Maps_ID, containerStyle, defaultCenter, libraries } from './mapConstants';
import { getMapOptions } from './MapOptions';
import MapButton from './MapButton';
import { useMapMarker } from './hooks/useMapMarker';
import { useMapDrawing } from './hooks/useMapDrawing';
import { useMapScreenshot } from './hooks/useMapScreenshot';

export default function MapComponent({ zoom, onMapClick, markerPosition, onMapScreenshot, disableCaptureButton }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: Maps_API_KEY,
    libraries,
  });

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const { currentMarker, handleMapClick, createOrUpdateMarker } = useMapMarker(mapRef, markerPosition || defaultCenter, isLoaded, onMapClick);
  const { drawingManagerRef, onDrawingManagerLoad, onOverlayComplete, drawingManagerOptions } = useMapDrawing(isLoaded);
  const { captureButtonRef, handleCaptureMap } = useMapScreenshot(mapContainerRef, mapRef, onMapScreenshot, disableCaptureButton);

  // Se ejecuta al cargar el mapa
  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
    if (markerPosition && (markerPosition.lat !== defaultCenter.lat || markerPosition.lng !== defaultCenter.lng)) {
      map.setCenter(markerPosition);
    } else {
      map.setCenter(defaultCenter);
    }
    map.setZoom(zoom || 13);

    if (isLoaded) {
        createOrUpdateMarker(); // Dibuja inicialmente el mapa
    }
  }, [markerPosition, zoom, isLoaded, createOrUpdateMarker]);

  // Se ejecuta cuando el componente del mapa se desmonta
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

      <MapButton ref={captureButtonRef} onClick={handleCaptureMap} disabled={disableCaptureButton} />
    </div>
  );
}