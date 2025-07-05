export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  const models = [
    "deepseek/deepseek-chat-v3-0324",
    "mistralai/mistral-small-3.2-24b-instruct",
    "google/gemma-3n-e4b-it:free"
  ];

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://turbotags.vercel.app",
          "X-Title": "TurboTags"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: "You are an expert in creating SEO-friendly tags and hashtags." },
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
      console.log(`${model} failed:`, error);
    }
  }

  // Fallback if all models fail
  res.status(200).json({
    text: "Tags: gaming, video, fun, viral\nHashtags: #Gaming #Fun #Trending"
  });
}
