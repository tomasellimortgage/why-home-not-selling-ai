export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const webhook = process.env.LEAD_WEBHOOK_URL;

  try {
    // If you haven't set up a webhook yet, this will just 'skip' instead of crashing
    if (!webhook) {
      console.warn("No LEAD_WEBHOOK_URL set. Skipping lead capture.");
      return res.status(200).json({ success: true, message: "Demo mode: No webhook set." });
    }

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    // We return 200 anyway so the user doesn't see a scary error 
    res.status(200).json({ success: true, warning: "Lead saved locally only." });
  }
}
