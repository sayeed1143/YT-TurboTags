export default async function handler(req, res) {
  const { prompt } = req.body;

  const models = [
    "deepseek-chat",
    "mistral-small-3.2",
    "google/gemma-4b-it"
  ];

  const apiKey = process.env.OPENROUTER_API_KEY;

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: "You are an expert in writing SEO-friendly social media tags and hashtags." },
            { role: "user", content: prompt }
          ]
        })
      });

      const result = await response.json();
      const text = result.choices?.[0]?.message?.content;

      if (text) {
        return res.status(200).json({ text });
      }

    } catch (error) {
      console.log(`${model} failed. Trying next...`);
    }
  }

  res.status(200).json({ text: null });
}
