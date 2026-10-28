export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "POST method required"
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured"
      });
    }

    const { prompt, language } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Please enter a story topic"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write an original, engaging story in ${language || "Hindi"} based on this topic: ${prompt}. Do not copy existing stories.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: data.error?.message || "AI generation failed"
      });
    }

    const story = data.candidates?.[0]?.content?.parts
      ?.map((part: any) => part.text || "")
      .join("\n");

    return res.status(200).json({
      story: story || "No story generated"
    });
  } catch {
    return res.status(500).json({
      error: "Server error while generating story"
    });
  }
}
