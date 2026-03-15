import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Must be gpt-4o for reliable web browsing
      messages: [
        {
          role: "system",
          content: "You are a real estate analyst. Use the provided tool to research the Zillow link and return a JSON object with 'reasons' (array) and 'recommendations' (string)."
        },
        {
          role: "user",
          content: `Analyze this home listing: ${url}`
        }
      ],
      tools: [{ type: "web_search" }], // Enables browsing
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    res.status(200).json(content);
  } catch (error) {
    console.error("DEBUG:", error);
    res.status(500).json({ error: error.message });
  }
}
