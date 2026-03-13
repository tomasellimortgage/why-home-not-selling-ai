import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body || {};

    if (!url) {
      return res.status(400).json({ error: "Missing listing URL" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
A homeowner submitted this property listing URL:

${url}

Act like a sharp real estate listing analyst.

Return ONLY valid JSON in this exact format:
{
  "reasons": [
    "reason 1",
    "reason 2",
    "reason 3",
    "reason 4",
    "reason 5"
  ],
  "recommendations": "one short paragraph of practical advice"
}

Focus on:
- price vs comps
- photo quality
- listing description
- days on market
- buyer financing obstacles
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: prompt,
    });

    const text = (response.output_text || "").trim();

    if (!text) {
      return res.status(200).json({
        reasons: [
          "The listing price may be too aggressive for the current market.",
          "The first photo may not create a strong enough first impression.",
          "The description may not speak to buyer motivations clearly enough.",
          "Longer days on market can make buyers assume something is wrong.",
          "Monthly payment friction from taxes, HOA, or insurance may be limiting demand."
        ],
        recommendations:
          "Review pricing, improve the lead photo, tighten the description, and evaluate buyer affordability obstacles. A local expert can usually spot the disconnect fast."
      });
    }

    try {
      const parsed = JSON.parse(text);
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json({
        reasons: [
          "The listing price may be too aggressive for the current market.",
          "The first photo may not create a strong enough first impression.",
          "The description may not speak to buyer motivations clearly enough.",
          "Longer days on market can make buyers assume something is wrong.",
          "Monthly payment friction from taxes, HOA, or insurance may be limiting demand."
        ],
        recommendations:
          "Review pricing, improve the lead photo, tighten the description, and evaluate buyer affordability obstacles. A local expert can usually spot the disconnect fast."
      });
    }
  } catch (error) {
    console.error("ANALYZE ERROR:", error);

    return res.status(500).json({
      error: "Analyze route failed",
      details: error?.message || "Unknown error",
    });
  }
}
