import OpenAI from "openai";

export default async function handler(req, res) {

  const { url } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `
A homeowner submitted this listing:

${url}

Act as a real estate listing expert.

Give the 5 most likely reasons the home has not sold yet.

Focus on:
- price vs comps
- photo quality
- listing description
- days on market
- buyer financing obstacles

Return JSON like this:

{
 "reasons": [
   "reason 1",
   "reason 2",
   "reason 3",
   "reason 4",
   "reason 5"
 ],
 "recommendations": "summary advice"
}
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  const text = completion.choices[0].message.content;

  try {
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch {

    res.status(200).json({
      reasons: [
        "Listing price may be higher than comparable homes nearby",
        "The first listing photo may not attract buyers",
        "The description may not highlight buyer benefits",
        "Long days on market can signal issues to buyers",
        "Financing barriers like taxes or HOA could affect affordability"
      ],
      recommendations:
        "Consider reviewing pricing strategy, upgrading photos, rewriting the description, and getting a second opinion from a local expert."
    });

  }
}
