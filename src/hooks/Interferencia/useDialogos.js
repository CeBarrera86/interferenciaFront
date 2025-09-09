import { useState, useCallback } from 'react';

export function useDialogos(form) {
  const { reset } = form;

  const [abrirDialogoExito, setAbrirDialogoExito] = useState(false);
  const [abrirDialogoError, setAbrirDialogoError] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [detallesError, setDetallesError] = useState('');
  const [idInterferencia, setIdInterferencia] = useState(null);

  const cerrarDialogoError = () => setAbrirDialogoError(false);

  const resetearFormularioYMapa = useCallback((limpiarAdjunto, setFormasDibujadas) => {
    reset();
    setAbrirDialogoExito(false);
    setFormasDibujadas([]);
    limpiarAdjunto();
  }, [reset]);

  return {
    abrirDialogoExito,
    mensajeExito,
    idInterferencia,
    abrirDialogoError,
    mensajeError,
    detallesError,
    cerrarDialogoError,
    setAbrirDialogoExito,
    setMensajeExito,
    setIdInterferencia,
    setAbrirDialogoError,
    setMensajeError,
    setDetallesError,
    resetearFormularioYMapa,
  };
}
