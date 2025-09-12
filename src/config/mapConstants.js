import { corpicoPalette as paleta } from '../styles/theme';

export const Maps_API_KEY = import.meta.env.VITE_MAPS_API_KEY || 'YOUR_FALLBACK_API_KEY';
export const Maps_ID = import.meta.env.VITE_MAPS_ID || 'YOUR_FALLBACK_MAP_ID';

export const containerStyle = {
  width: '100%',
  height: '500px',
  position: 'relative',
};

export const libraries = ['drawing', 'marker'];

export const corpicoColores = Object.values(paleta);