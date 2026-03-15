import OpenAI from "openai";

// This tells Vercel to allow this function to run for up to 60 seconds
export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address is required" });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini-search-preview", // Fast search-enabled model
      messages: [
        {
          role: "system",
          content: "You are a real estate analyst. Search for the property address provided. Identify why it isn't selling (price, market trends, etc.). Return ONLY JSON: { \"reasons\": [], \"recommendations\": \"\" }"
        },
        {
          role: "user",
          content: `Analyze this home: ${address}`
        }
      ],
      // This is the tool for 2026 search
      tools: [{ type: "web_search_preview" }], 
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    res.status(200).json(content);
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ error: "Search timed out. Try a more specific address (City, State)." });
  }
}
