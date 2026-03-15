export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const webhook = process.env.LEAD_WEBHOOK_URL;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) throw new Error("Webhook failed");

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to capture lead" });
  }
}
