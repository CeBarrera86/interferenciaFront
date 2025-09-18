export function useEnvioInterferencia(form, dialogos) {
  const {
    setAbrirDialogoError,
    setMensajeError,
    setDetallesError,
    setAbrirDialogoExito,
    setMensajeExito,
    setIdInterferencia,
  } = dialogos;

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

    for (const key in data) {
      const value = data[key];

      if (key === 'SOI_UBICACIONES') {
        serializarUbicaciones(value).forEach(([k, v]) => formData.append(k, v));
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

    try {
      const response = await fetch('http://localhost:3000/api/interferencia/store', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setMensajeError(result.message || 'Error desconocido.');
        setDetallesError(result.error || result.errors?.map(e => e.msg).join(', ') || '');
        setAbrirDialogoError(true);
        return false;
      }

      setMensajeExito(result.message);
      setIdInterferencia(result.id);
      setAbrirDialogoExito(true);
      return true;
    } catch (error) {
      setMensajeError('Error de conexión.');
      setDetallesError(error.message);
      setAbrirDialogoError(true);
      return false;
    }
  };

  return { onSubmit: enviarFormulario };
}