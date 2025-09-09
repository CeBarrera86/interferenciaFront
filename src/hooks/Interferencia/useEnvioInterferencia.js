export function useEnvioInterferencia(form, dialogos) {
  const { setAbrirDialogoError, setMensajeError, setDetallesError, setAbrirDialogoExito, setMensajeExito, setIdInterferencia } = dialogos;

  const enviarFormulario = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (key === 'SOI_UBICACIONES') {
        data[key].forEach((ubicacion, index) => {
          for (const ubiKey in ubicacion) {
            formData.append(`SOI_UBICACIONES[${index}][${ubiKey}]`, ubicacion[ubiKey]);
          }
        });
      } else if (data[key] instanceof File) {
        formData.append(key, data[key], data[key].name);
      } else if (key === 'SOI_EMPRESA') {
        formData.append(key, data[key].join(','));
      } else if (key === 'SOI_DESDE' || key === 'SOI_HASTA') {
        const date = new Date(data[key]);
        const formatted = `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${('0'+date.getDate()).slice(-2)}`;
        formData.append(key, formatted);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const response = await fetch('http://localhost:3000/api/interferencia/store', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMensajeError(errorData.message || 'Error desconocido.');
        setDetallesError(errorData.error || (errorData.errors?.map(e => e.msg).join(', ')) || '');
        setAbrirDialogoError(true);
        return false;
      }

      const result = await response.json();
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
