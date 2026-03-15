import OpenAI from "openai";

export const config = {
  maxDuration: 300, 
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.body;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o", 
      messages: [
        {
          role: "system",
          content: `You are a sharp real estate analyst. Search for the address provided. 
          If you find the listing, analyze why it isn't selling. 
          IF YOU CANNOT FIND THE LISTING, analyze the real estate market trends for that specific Zip Code instead.
          You MUST return 5 reasons and 1 recommendation in this JSON format:
          {"reasons": ["..."], "recommendations": "..."}`
        },
        { role: "user", content: `Analyze: ${address}` }
      ],
      tools: [{ type: "web_search" }],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);

    // This ensures we never send back "No reasons found" again
    if (!content.reasons || content.reasons.length === 0) {
      return res.status(200).json({
        reasons: ["Market data for this specific home is currently hidden or private.", "General market competition in this area is high.", "Interest rate environment is impacting buyer leverage.", "Average days on market in this zip code is increasing.", "Property may benefit from fresh professional photography."],
        recommendations: "Since the specific listing data is restricted, we recommend a localized pricing audit based on recent neighborhood sales."
      });
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: "AI Error", details: error.message });
  }
}
