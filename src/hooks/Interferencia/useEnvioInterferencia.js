export function useEnvioInterferencia(form, dialogos) {
  const { dispatch } = dialogos;

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const enviarFormulario = async (data) => {
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

    const modo = import.meta.env.VITE_MODO?.trim().toLowerCase();
    const esDev = modo === 'dev';

    const baseURL = esDev
      ? `${import.meta.env.VITE_URL_BASE}:${import.meta.env.VITE_PORT}`
      : `${import.meta.env.VITE_URL_BASE}:${import.meta.env.VITE_PORT}`;

    try {
      const response = await fetch(`${baseURL}/api/interferencia/store`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        dispatch({
          type: 'ERROR',
          payload: {
            message: result.message || 'Error desconocido.',
            details: result.error || result.errors?.map(e => e.msg).join(', ') || '',
          },
        });
        return false;
      }

      dispatch({
        type: 'EXITO',
        payload: { message: result.message, id: result.id, },
      });
      return true;
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: 'Error de conexión.', details: error.message, },
      });
      return false;
    }
  };

  return { onSubmit: enviarFormulario };
}