import { useReducer, useCallback, useRef } from 'react';

export function useDialogos(form) {
  const { reset } = form;

  const initialState = {
    abrirDialogoExito: false,
    abrirDialogoError: false,
    abrirDialogoEspera: false,
    mensajeExito: '',
    mensajeError: '',
    detallesError: '',
    idInterferencia: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'ESPERA_ON':
        return { ...state, abrirDialogoEspera: true };
      case 'ESPERA_OFF':
        return { ...state, abrirDialogoEspera: false };
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

  const esperarInicioRef = useRef(null);
  const MIN_DISPLAY_MS = 600;

  // Abre el diálogo de espera y registra el momento de inicio
  const abrirEspera = () => {
    // record start timestamp
    try { esperarInicioRef.current = Date.now(); } catch (e) { esperarInicioRef.current = Date.now(); }

    // Blur focused element to avoid aria-hidden conflicts when a dialog is shown
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    dispatch({ type: 'ESPERA_ON' });
  };

  // Cierra el diálogo de espera garantizando un tiempo mínimo visible
  const cerrarEspera = (cb) => {
    const started = esperarInicioRef.current || 0;
    const elapsed = Date.now() - started;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    if (remaining === 0) {
      dispatch({ type: 'ESPERA_OFF' });
      if (cb) cb();
    } else {
      setTimeout(() => {
        dispatch({ type: 'ESPERA_OFF' });
        if (cb) cb();
      }, remaining);
    }
  };

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
    abrirEspera,
    cerrarEspera,
    cerrarDialogoError,
    resetearFormularioYMapa,
  };
}