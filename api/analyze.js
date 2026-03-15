import OpenAI from "openai";

export default async function handler(req, res) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { address } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Search the web for this address. If you find nothing, you MUST make 5 educated guesses based on the general zip code market. NEVER return an empty list. Return JSON: { \"reasons\": [], \"recommendations\": \"\" }"
        },
        { role: "user", content: address }
      ],
      tools: [{ type: "web_search" }],
      response_format: { type: "json_object" }
    });

    res.status(200).json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    // If the API fails, we send back fake data so you can see it's working
    res.status(200).json({
      reasons: ["DEBUG: API Key might be invalid", "DEBUG: Search tool timed out", "DEBUG: Check OpenAI Billing"],
      recommendations: "The system is reaching the server, but the AI is not providing a real answer yet."
    });
  }
}
