export async function getEmbedding(text) {
  const apiUrl = '/api/embed';  

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    return result.embeddings;

  } catch (error) {
    console.error('Error al generar embedding:', error);
    return null;
  }
}


export async function getEmbeddingsFromChunks(chunks) {
  const embeddings = [];

  for (const chunk of chunks) {
    const vector = await getEmbedding(chunk);
    if (vector) {
      embeddings.push({ text: chunk, embedding: vector[0] });
    }
  }

  return embeddings;
}