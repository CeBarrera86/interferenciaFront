/**
 * Cliente ligero para la API de interferencias.
 * Implementa timeout (AbortController) y devuelve una forma consistente de respuesta.
 */
export async function sendInterferencia(formData, { baseURL = '', timeout = 15000 } = {}) {
  const url = `${baseURL}/api/interferencia/store`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    let body;
    try {
      body = await response.json();
    } catch (err) {
      body = { message: response.statusText || 'Respuesta inválida del servidor.' };
    }

    return { ok: response.ok, status: response.status, body };
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('timeout');
      timeoutErr.name = 'TimeoutError';
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
