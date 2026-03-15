export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    return res.status(200).json({ success: true, message: "No webhook configured." });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...req.body,
        timestamp: new Date().toISOString(),
        source: "Home Analyzer App"
      }),
    });

    if (!response.ok) throw new Error("Webhook Error");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Lead Error:", error);
    res.status(500).json({ error: "Lead capture failed" });
  }
}
