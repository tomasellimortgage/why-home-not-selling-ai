import OpenAI from "openai";

export const config = {
  maxDuration: 300, // Vercel Pro allows up to 5 minutes
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.body;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-search-preview", // 2026 specialized search model
      messages: [
        {
          role: "system",
          content: "Find the property listing for this address. Analyze why it isn't selling. Return ONLY valid JSON."
        },
        { role: "user", content: `Address: ${address}` }
      ],
      tools: [{ type: "web_search" }], 
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              reasons: { type: "array", items: { type: "string" } },
              recommendations: { type: "string" }
            },
            required: ["reasons", "recommendations"],
            additionalProperties: false
          }
        }
      }
    });

    const report = JSON.parse(response.choices[0].message.content);
    res.status(200).json(report);
  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({ error: "The AI search tool is temporarily unavailable. Check your OpenAI Tier 1 status." });
  }
}
