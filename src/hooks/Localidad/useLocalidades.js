import { useEffect, useReducer } from 'react';

const initialState = {
  localidades: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SUCCESS':
      return { localidades: action.payload, loading: false, error: null };
    case 'ERROR':
      return { localidades: [], loading: false, error: action.payload };
    default:
      return state;
  }
}

export function useLocalidades() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL_BASE}:${import.meta.env.VITE_PORT}/api/localidades`);
        // const response = await fetch(`${import.meta.env.VITE_URL_BASE_SSL}:${import.meta.env.VITE_PORT_SSL}/api/localidades`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const formatted = data.map(loc => ({
          id: loc.LOC_ID,
          nombre: loc.LOC_DESCRIPCION,
        }));

        dispatch({ type: 'SUCCESS', payload: formatted });
      } catch (error) {
        console.error('Error fetching localidades:', error);
        dispatch({ type: 'ERROR', payload: error });
      }
    };

    fetchLocalidades();
  }, []);

  return {
    localidades: state.localidades,
    loadingLocalidades: state.loading,
    errorLocalidades: state.error,
  };
}