async function generateTags() {
  const platform = document.getElementById('platform').value;
  const topic = document.getElementById('topicInput').value.trim();

  if (!topic) {
    alert("Please enter a topic!");
    return;
  }

  const prompt = `Generate 15-20 SEO optimized tags and hashtags for ${platform} about "${topic}". Separate tags and hashtags clearly.`;

  try {
    const response = await fetch("/api/generate-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const result = await response.json();
    const responseText = result.text;

    if (responseText) {
      const tagsMatch = responseText.match(/Tags:(.*?)(Hashtags:|$)/is);
      const hashtagsMatch = responseText.match(/Hashtags:(.*)/is);

      const tags = tagsMatch ? tagsMatch[1].trim() : "No tags found.";
      const hashtags = hashtagsMatch ? hashtagsMatch[1].trim() : "No hashtags found.";

      document.getElementById('tagsOutput').value = tags;
      document.getElementById('hashtagsOutput').value = hashtags;
    } else {
      alert("AI did not return results. Try again.");
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong.");
  }
}

function copyToClipboard(id) {
  const text = document.getElementById(id);
  text.select();
  document.execCommand("copy");
}
