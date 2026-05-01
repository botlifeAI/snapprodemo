export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY is not set in environment variables' } });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: req.body.system,
        messages: req.body.messages
      })
    });

    const data = await response.json();

    // If Anthropic returned an error, pass the full error back
    if (!response.ok) {
      return res.status(200).json({
        error: {
          message: JSON.stringify(data)
        }
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: { message: 'Server error: ' + err.message } });
  }
}
