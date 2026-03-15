export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (response.ok) {
      return res.status(200).json({ message: "Lead captured successfully!" });
    } else {
      throw new Error("Webhook rejected the lead.");
    }
  } catch (error) {
    console.error("LEAD ERROR:", error);
    return res.status(500).json({ error: "Failed to save lead." });
  }
}
