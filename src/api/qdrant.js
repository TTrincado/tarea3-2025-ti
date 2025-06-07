import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.VITE_QDRANT_URL,
  apiKey: process.env.VITE_QDRANT_API_KEY,
});

const COLLECTION_NAME = "wiki-embeddings";

export default async function handler(req, res) {
  const { method } = req;
  if (method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, payload } = req.body;

  try {
    if (action === "initCollection") {
      try {
        await client.createCollection(COLLECTION_NAME, {
          vectors: { size: 768, distance: "Cosine" },
        });
        return res.status(200).json({ message: `Colección creada` });
      } catch (err) {
        if (
          err.message.includes("Conflict") ||
          err.message.includes("already exists")
        ) {
          return res.status(200).json({
            message: `Colección ya existe, usando existente`,
          });
        }
        throw err;
      }
    }

    if (action === "deleteCollection") {
      await client.deleteCollection(COLLECTION_NAME);
      return res.status(200).json({ message: "Colección borrada" });
    }

    if (action === "saveEmbeddings") {
      const points = payload.chunksWithEmbeddings.map((item, idx) => ({
        id: idx + 1,
        vector: item.embedding,
        payload: { text: item.text },
      }));
      await client.upsert(COLLECTION_NAME, { points });
      return res.status(200).json({ message: "Embeddings guardados" });
    }

    if (action === "searchSimilarChunks") {
      const { queryEmbedding, topK = 5 } = payload;
      const result = await client.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        top: topK,
      });
      return res.status(200).json(result.map((r) => r.payload));
    }

    return res.status(400).json({ error: "Acción no soportada" });
  } catch (error) {
    console.error("Error en API qdrant:", error);
    return res.status(500).json({ error: error.message });
  }
}
