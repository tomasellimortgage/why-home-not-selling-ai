import OpenAI from "openai";

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  const { address } = req.body;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `
    You are a Senior Real Estate Strategist diagnosing stagnant listings for Steve Tomaselli (32 years experience).
    Search the web for the address: ${address}.
    
    Perform a 7-Step Diagnostic internally:
    1. Context (Price/Days on Market)
    2. Visuals (Photo quality/count)
    3. Narrative (Description quality)
    4. Comps (Nearby competition)
    5. Friction (Why isn't it moving?)
    6. Engagement (Showings/Offers)
    7. Transition Planning (The "Next Move" gap)

    RETURN THE FINAL REPORT IN THIS JSON FORMAT:
    {
      "visualScore": 8,
      "analysis": ["point 1", "point 2", "point 3"],
      "rescueStrategy": "Your primary strategy to reset interest",
      "steveTomaselliOffer": "How Steve's 32 years of experience helps with the 'Next Move' transition",
      "oneSentenceSummary": "The core reason it hasn't sold."
    }
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }],
      tools: [{ type: "web_search" }], // AI researches the home
      response_format: { type: "json_object" }
    });

    res.status(200).json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: "AI failed to research home." });
  }
}
