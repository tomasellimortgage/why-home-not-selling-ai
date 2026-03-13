
import OpenAI from "openai";

export default async function handler(req,res){

  const {url} = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `
A homeowner submitted this listing:
${url}

Provide the 5 most common reasons homes fail to sell:
- pricing vs comps
- photos
- description quality
- days on market perception
- financing barriers

Return JSON format:
{
 "reasons":[],
 "recommendations":""
}
`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.4",
    input: prompt
  });

  let text = response.output[0].content[0].text;

  try{
    const json = JSON.parse(text);
    res.json(json);
  }catch{
    res.json({
      reasons:[
        "Price may be higher than nearby comparable sales",
        "Listing photos may not showcase the property effectively",
        "Description may not target active buyers",
        "Extended days on market may signal issues",
        "Financing barriers such as taxes or HOA"
      ],
      recommendations:"Consider reviewing pricing strategy, improving listing photos, rewriting the description, and consulting a local expert."
    });
  }
}
