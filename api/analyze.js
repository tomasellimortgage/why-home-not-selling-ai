import OpenAI from "openai";

export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  const { address } = req.body;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    // 1. USE FIRECRAWL TO GET THE DATA (Bypass Zillow Blocks)
    const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: address, formats: ['markdown'] })
    });
    const scrapeData = await scrapeRes.json();
    const listingText = scrapeData.data?.markdown || "No data found";

    // 2. RUN THE STEVE TOMASELLI DIAGNOSTIC
    const systemPrompt = `
      You are a Senior Real Estate Strategist diagnosing a listing for Steve Tomaselli (32 years experience).
      Analyze the listing data provided below.
      
      Listing Data: ${listingText}

      Determine the Visual Score (1-10) based on photo mentions/descriptions.
      Identify 6 specific friction points.
      Create a Rescue Strategy.
      Explain how Steve Tomaselli's 32 years of mortgage experience helps with the 'Sell-to-Buy' transition.

      RETURN JSON:
      {
        "visualScore": 9,
        "analysis": ["point 1", "point 2", "point 3", "point 4", "point 5", "point 6"],
        "rescueStrategy": "...",
        "steveTomaselliOffer": "...",
        "oneSentenceSummary": "..."
      }
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" }
    });

    res.status(200).json(JSON.parse(response.choices[0].message.content));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Diagnostic failed to read the property data." });
  }
}
