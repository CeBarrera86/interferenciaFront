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