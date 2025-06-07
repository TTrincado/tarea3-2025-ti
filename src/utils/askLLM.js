export async function askLLM(context, question) {
  const apiUrl = '/api/completions'; 

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, question }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LLM API Error ${response.status}: ${errorText}`);
      return `Error del servidor LLM (${response.status})`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? 'Error al generar respuesta.';
  } catch (err) {
    console.error('Error al llamar a la API del LLM:', err);
    return 'Error de red al llamar al LLM.';
  }
}
