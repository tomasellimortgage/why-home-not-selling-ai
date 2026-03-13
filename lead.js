export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const webhook = process.env.LEAD_WEBHOOK_URL;

    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body || {}),
      });
    }

    return res.status(200).send("Thank you! A local expert will contact you shortly.");
  } catch (error) {
    return res.status(500).send("Lead submission failed.");
  }
}
