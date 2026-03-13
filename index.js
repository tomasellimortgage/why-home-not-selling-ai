import { useState } from "react";

export default function Home() {

  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {

    if (!url) {
      alert("Please paste a listing URL first.");
      return;
    }

    setLoading(true);
    setReport(null);

    try {

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data);

      setReport(data);

    } catch (error) {

      console.error("Analyze error:", error);

      alert("Something went wrong analyzing the listing.");

    }

    setLoading(false);
  }

  return (
    <div style={{
      fontFamily: "Arial",
      maxWidth: 700,
      margin: "60px auto",
      padding: 20
    }}>

      <h1>Why Isn’t My Home Selling?</h1>

      <p>Paste your Zillow or MLS listing link.</p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste listing URL"
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16
        }}
      />

      <button
        onClick={analyze}
        style={{
          marginTop: 10,
          padding: 12,
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        Analyze Listing
      </button>

      {loading && (
        <p style={{ marginTop: 20 }}>
          Analyzing listing...
        </p>
      )}

      {report && (
        <div style={{ marginTop: 40 }}>

          <h2>Top Reasons Your Home May Not Be Selling</h2>

          <ul>
            {report.reasons?.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          <h3>Recommendations</h3>

          <p>{report.recommendations}</p>

          <hr style={{ marginTop: 40 }} />

          <h3>Want a second opinion from a local expert?</h3>

          <form action="/api/lead" method="POST">

            <input
              name="name"
              placeholder="Name"
              required
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
              name="email"
              placeholder="Email"
              required
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input
              name="phone"
              placeholder="Phone"
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
            />

            <input type="hidden" name="listing" value={url} />

            <button
              type="submit"
              style={{
                padding: 12,
                cursor: "pointer"
              }}
            >
              Connect with a Local Expert
            </button>

          </form>

        </div>
      )}

    </div>
  );
}
