import { useReducer, useCallback } from 'react';

export function useDialogos(form) {
  const { reset } = form;

  const initialState = {
    abrirDialogoExito: false,
    abrirDialogoError: false,
    mensajeExito: '',
    mensajeError: '',
    detallesError: '',
    idInterferencia: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'EXITO':
        return {
          ...state,
          abrirDialogoExito: true,
          mensajeExito: action.payload.message,
          idInterferencia: action.payload.id,
        };
      case 'ERROR':
        return {
          ...state,
          abrirDialogoError: true,
          mensajeError: action.payload.message,
          detallesError: action.payload.details,
        };
      case 'CERRAR_ERROR':
        return { ...state, abrirDialogoError: false };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const cerrarDialogoError = () => dispatch({ type: 'CERRAR_ERROR' });

  const resetearFormularioYMapa = useCallback((limpiarAdjunto, setFormasDibujadas) => {
    reset();
    dispatch({ type: 'RESET' });
    setFormasDibujadas([]);
    limpiarAdjunto();
  }, [reset]);

  return {
    ...state,
    dispatch,
    cerrarDialogoError,
    resetearFormularioYMapa,
  };
}