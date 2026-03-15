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
          content: "Use the web search tool to find the property listing for the provided address. Identify why it hasn't sold yet. Return ONLY valid JSON with 'reasons' (array) and 'recommendations' (string)."
        },
        { role: "user", content: `Address: ${address}` }
      ],
      tools: [{ type: "web_search" }],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    
    // This will appear in your Vercel Logs
    console.log("SUCCESSFUL AI SEARCH:", content);

    res.status(200).json(content);
  } catch (error) {
    console.error("SEARCH ERROR:", error.message);
    res.status(500).json({ error: "AI Research Failed", details: error.message });
  }
}
