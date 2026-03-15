import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      tools: [{ type: "web_search_preview" }], // This allows the AI to visit the link
      input: `Open this Zillow listing: ${url}. 
      Analyze why it isn't selling by looking at the price history, days on market, and description quality. 
      Return the analysis in this JSON format:
      {
        "reasons": ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5"],
        "recommendations": "Provide a summary of advice here."
      }`,
      response_format: { type: "json_object" } 
    });

    // Extract the text from the response items
    const text = response.output[0].text;
    res.status(200).json(JSON.parse(text));

  } catch (error) {
    console.error("ANALYSIS ERROR:", error);
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
}
