import { sendInterferencia } from '../../api/interferencia';

export function useEnvioInterferencia(form, dialogos) {
  const { dispatch } = dialogos;

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const enviarFormulario = async (data) => {
    // Mostrar diálogo de espera (usa la API de dialogos si está disponible)
    if (dialogos && typeof dialogos.abrirEspera === 'function') {
      dialogos.abrirEspera();
    } else {
      dispatch({ type: 'ESPERA_ON' });
    }

    const formData = new FormData();

    for (const key in data) {
      const value = data[key];

      if (key === 'SOI_UBICACIONES') {
        formData.append('SOI_UBICACIONES', JSON.stringify(value));
      } else if (key === 'SOI_DOCUMENTO' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) { formData.append('SOI_DOCUMENTO', file, file.name); }
        });
      } else if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (key === 'SOI_EMPRESA') {
        formData.append(key, value.join(','));
      } else if (key === 'SOI_DESDE' || key === 'SOI_HASTA') {
        formData.append(key, formatearFecha(value));
      } else {
        formData.append(key, value);
      }
    }

    // Construir baseURL a partir de variables de entorno. Dejar tal cual si no están definidas.
    const baseURL = `${import.meta.env.VITE_URL_BASE || ''}:${import.meta.env.VITE_PORT || ''}`;

    try {
      const { ok, status, body } = await sendInterferencia(formData, { baseURL, timeout: 15000 });

      // Cerrar diálogo de espera respetando tiempo mínimo, luego abrir diálogo correspondiente
      if (dialogos && typeof dialogos.cerrarEspera === 'function') {
        dialogos.cerrarEspera(() => {
          if (!ok) {
            dispatch({
              type: 'ERROR',
              payload: {
                message: body?.message || 'Error desconocido.',
                details: body?.error || body?.errors?.map(e => e.msg).join(', ') || '',
              },
            });
          } else {
            dispatch({
              type: 'EXITO',
              payload: { message: body?.message, id: body?.id, },
            });
          }
        });
      } else {
        // Fallback inmediato
        dispatch({ type: 'ESPERA_OFF' });
        if (!ok) {
          dispatch({
            type: 'ERROR',
            payload: {
              message: body?.message || 'Error desconocido.',
              details: body?.error || body?.errors?.map(e => e.msg).join(', ') || '',
            },
          });
          return false;
        }

        dispatch({
          type: 'EXITO',
          payload: { message: body?.message, id: body?.id, },
        });
      }

      return true;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        const msg = 'La solicitud tardó demasiado tiempo. Intenta nuevamente.';
        if (dialogos && typeof dialogos.cerrarEspera === 'function') {
          dialogos.cerrarEspera(() => {
            dispatch({ type: 'ERROR', payload: { message: msg, details: '' } });
          });
        } else {
          dispatch({ type: 'ESPERA_OFF' });
          dispatch({ type: 'ERROR', payload: { message: msg, details: '' } });
        }
        return false;
      }
      if (dialogos && typeof dialogos.cerrarEspera === 'function') {
        dialogos.cerrarEspera(() => {
          dispatch({
            type: 'ERROR',
            payload: { message: 'Error de conexión.', details: error.message, },
          });
        });
      } else {
        dispatch({ type: 'ESPERA_OFF' });
        dispatch({
          type: 'ERROR',
          payload: { message: 'Error de conexión.', details: error.message, },
        });
      }

      return false;
    }
  };

  return { onSubmit: enviarFormulario };
}