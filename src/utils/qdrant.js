export async function initCollection() {
  const res = await fetch('/api/qdrant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'initCollection' }),
  });
  const data = await res.json();
  console.log(data);
}

export async function saveEmbeddings(chunksWithEmbeddings) {
  const res = await fetch('/api/qdrant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'saveEmbeddings', payload: { chunksWithEmbeddings } }),
  });
  const data = await res.json();
  console.log(data);
}

export async function searchSimilarChunks(queryEmbedding, topK) {
  const res = await fetch('/api/qdrant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'searchSimilarChunks', payload: { queryEmbedding, topK } }),
  });
  const data = await res.json();
  return data;
}
