export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

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
        model: "deepseek-chat-v3-0324",  // ✅ Only DeepSeek V3 used
        messages: [
          { role: "system", content: "You are an expert at generating short, viral, SEO-friendly tags and hashtags for social media videos." },
          { role: "user", content: prompt }
        ]
      })
    });

    const result = await response.json();
    const text = result?.choices?.[0]?.message?.content;

    if (text) {
      return res.status(200).json({ text });
    } else {
      return res.status(200).json({
        text: "Tags: viral, trending, content\nHashtags: #Viral #Trending #Content"
      });
    }

  } catch (error) {
    console.error("DeepSeek failed:", error);
    res.status(500).json({
      text: "Tags: viral, trending, content\nHashtags: #Viral #Trending #Content"
    });
  }
}
