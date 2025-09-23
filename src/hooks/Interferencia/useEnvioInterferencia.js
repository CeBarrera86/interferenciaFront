export function useEnvioInterferencia(form, dialogos) {
  const { dispatch } = dialogos;

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const serializarUbicaciones = (ubicaciones) => {
    return ubicaciones.flatMap((ubi, index) =>
      Object.entries(ubi).map(([key, value]) => [`SOI_UBICACIONES[${index}][${key}]`, value])
    );
  };

  const enviarFormulario = async (data) => {
    const formData = new FormData();

    console.log('📝 Datos del formulario antes de serializar:', data);

    for (const key in data) {
      const value = data[key];

      if (key === 'SOI_UBICACIONES') {
        const ubicacionesSerializadas = serializarUbicaciones(value);
        console.log('📦 Ubicaciones serializadas:', ubicacionesSerializadas);
        ubicacionesSerializadas.forEach(([k, v]) => formData.append(k, v));
      } else if (key === 'SOI_DOCUMENTO' && Array.isArray(value)) {
        console.log('📎 Archivos adjuntos:', value);
        value.forEach((file, i) => {
          if (file instanceof File) {
            formData.append(`SOI_DOCUMENTO[${i}]`, file, file.name);
          }
        });
      } else if (value instanceof File) {
        console.log(`📎 Archivo único: ${key}`, value);
        formData.append(key, value, value.name);
      } else if (key === 'SOI_EMPRESA') {
        console.log('🏢 Empresa:', value);
        formData.append(key, value.join(','));
      } else if (key === 'SOI_DESDE' || key === 'SOI_HASTA') {
        const fechaFormateada = formatearFecha(value);
        console.log(`📅 Fecha ${key}:`, fechaFormateada);
        formData.append(key, fechaFormateada);
      } else {
        console.log(`🔑 Campo ${key}:`, value);
        formData.append(key, value);
      }
    }

    console.log('📤 Enviando FormData al backend...');

    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BASE}:${import.meta.env.VITE_PORT}/api/interferencia/store`, {
        method: 'POST',
        body: formData,
      });
      // const response = await fetch(`${import.meta.env.VITE_URL_BASE_SSL}:${import.meta.env.VITE_PORT_SSL}/api/interferencia/store`, {
      //   method: 'POST',
      //   body: formData,
      // });
      const result = await response.json();
      console.log('📥 Respuesta del backend:', result);

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
        payload: {
          message: result.message,
          id: result.id,
        },
      });
      return true;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      dispatch({
        type: 'ERROR',
        payload: {
          message: 'Error de conexión.',
          details: error.message,
        },
      });
      return false;
    }
  };

  return { onSubmit: enviarFormulario };
}