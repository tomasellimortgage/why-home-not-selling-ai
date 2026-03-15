import OpenAI from "openai";

export const config = {
  maxDuration: 300, // Taking advantage of your Pro Plan
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address } = req.body;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: "You are a real estate analyst. Search for the property provided. Identify exactly why it hasn't sold. You must return valid JSON."
        },
        { role: "user", content: `Analyze the listing for: ${address}` }
      ],
      tools: [{ type: "web_search" }],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "analysis_report",
          schema: {
            type: "object",
            properties: {
              reasons: { type: "array", items: { type: "string" } },
              recommendations: { type: "string" }
            },
            required: ["reasons", "recommendations"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    const report = JSON.parse(response.choices[0].message.content);
    res.status(200).json(report);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "The AI was unable to complete the search. Please check the address." });
  }
}
