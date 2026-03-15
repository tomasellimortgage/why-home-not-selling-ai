import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.body; // We now take 'address' instead of 'url'
  if (!address) return res.status(400).json({ error: "No address provided" });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-search-preview", // 2026 model with native web search
      messages: [
        {
          role: "system",
          content: "You are a real estate expert. Search for the provided property address. Analyze its current listing status, price history, and photos. Return ONLY a JSON object with keys 'reasons' (array) and 'recommendations' (string)."
        },
        {
          role: "user",
          content: `Why isn't this home selling? Address: ${address}`
        }
      ],
      web_search_options: {
        user_location: { type: "approximate", approximate: { country: "US" } }
      },
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    res.status(200).json(content);
  } catch (error) {
    console.error("ANALYSIS ERROR:", error);
    res.status(500).json({ error: "The AI could not find that address. Try adding city and state." });
  }
}
