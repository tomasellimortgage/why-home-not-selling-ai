import OpenAI from "openai";

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  const { address } = req.body;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `
    You are a Senior Real Estate Strategist diagnosing stagnant listings. 
    Search the web for the address: ${address}. 
    Analyze visuals, pricing, market narrative, and transition friction.
    
    You must return this EXACT JSON structure:
    {
      "visualScore": 7,
      "analysis": ["point 1", "point 2", "point 3", "point 4", "point 5", "point 6"],
      "rescueStrategy": "Detailed strategy text here",
      "steveTomaselliOffer": "How Steve Tomaselli's 32 years of mortgage banking helps with the financial transition of selling and buying.",
      "oneSentenceSummary": "The core problem in one sentence."
    }
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }],
      tools: [{ type: "web_search" }],
      response_format: { type: "json_object" }
    });

    res.status(200).json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: "AI Diagnostic failed to research the home." });
  }
}
