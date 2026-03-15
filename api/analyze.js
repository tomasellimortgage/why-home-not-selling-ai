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
      model: "gpt-4o", // Using standard 4o for higher stability
      messages: [
        {
          role: "system",
          content: "Search for this property. If you cannot find the specific listing, analyze the local market trends for that neighborhood/zip code instead. Always return valid JSON."
        },
        { role: "user", content: `Analyze: ${address}` }
      ],
      tools: [{ type: "web_search" }],
      response_format: { type: "json_object" } // Using standard json_object for broader compatibility
    });

    const content = response.choices[0].message.content;
    
    // LOGGING: This shows up in your Vercel Dashboard -> Logs
    console.log("AI Output:", content);

    res.status(200).json(JSON.parse(content));
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
}
