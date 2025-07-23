import { Maps_ID } from './mapConstants';

export const getMapOptions = () => ({
  disableDefaultUI: false,
  fullscreenControl: false,
  mapTypeControl: false,
  rotateControl: false,
  scaleControl: false,
  streetViewControl: false,
  zoomControl: true,
  mapId: Maps_ID,
});

export const getDrawingManagerOptions = () => ({
  drawingControlOptions: {
    position: window.google.maps.ControlPosition.TOP_CENTER,
    drawingModes: [
      window.google.maps.drawing.OverlayType.POLYGON,
      window.google.maps.drawing.OverlayType.RECTANGLE,
    ],
  },
  polygonOptions: {
    fillColor: '#ffff00',
    fillOpacity: 0.2,
    strokeWeight: 1,
    clickable: false,
    editable: true,
    zIndex: 1,
  },
  rectangleOptions: {
    fillColor: '#ffff00',
    fillOpacity: 0.2,
    strokeWeight: 1,
    clickable: false,
    editable: true,
    zIndex: 1,
  },
});