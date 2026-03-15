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
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: "Search for this property listing. Analyze why it isn't selling. If you can't find the house, analyze the local zip code market. You MUST return JSON with 'reasons' (array) and 'recommendations' (string)."
        },
        { role: "user", content: `Analyze: ${address}` }
      ],
      tools: [{ type: "web_search" }],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Error", details: error.message });
  }
}
