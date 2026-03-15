import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!url) return alert("Please paste a link first.");
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();
      setReport(data);
    } catch (error) {
      alert("Error analyzing listing. Ensure the URL is public.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Home Listing Analyzer</h1>
      <input 
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
        placeholder="Paste Zillow URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={analyze} disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
        {loading ? "Analyzing..." : "Find Out Why It's Not Selling"}
      </button>

      {report && (
        <div style={{ marginTop: 30, borderTop: "1px solid #ccc", paddingTop: 20 }}>
          <h2>Top 5 Reasons:</h2>
          <ul>{report.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
          <h3>Our Recommendation:</h3>
          <p>{report.recommendations}</p>
        </div>
      )}
    </div>
  );
}
