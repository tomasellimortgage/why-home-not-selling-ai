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
      model: "gpt-4o-search-preview", 
      messages: [
        {
          role: "system",
          content: `You are a brutally honest Real Estate Investment Analyst. 
          Your job is to find a specific property address online (Zillow, Redfin, etc.) and find 5 reasons why it hasn't sold yet.
          Even if it looks like a good house, find flaws in the price history, the description, or the market competition.
          
          You MUST return this exact JSON structure:
          {
            "reasons": ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5"],
            "recommendations": "One paragraph of strategic advice."
          }`
        },
        { role: "user", content: `Analyze this property: ${address}` }
      ],
      tools: [{ type: "web_search" }],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    res.status(200).json(content);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Analysis failed. Please try a different address." });
  }
}
