export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, input } = req.body;

    const response = await fetch('https://asteroide.ing.uc.cl/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error from embed API' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error en serverless embed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
