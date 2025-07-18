export const Maps_API_KEY = import.meta.env.VITE_MAPS_API_KEY || 'YOUR_FALLBACK_API_KEY';
export const Maps_ID = import.meta.env.VITE_MAPS_ID || 'YOUR_FALLBACK_MAP_ID';

export const containerStyle = {
  width: '100%',
  height: '500px',
  position: 'relative',
};

export const defaultCenter = {
  lat: -35.65867,
  lng: -63.75715,
};

export const libraries = ['drawing', 'marker'];