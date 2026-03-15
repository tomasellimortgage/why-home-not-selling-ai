import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function startAnalysis() {
    if (!address) return alert("Please enter an address.");
    setLoading(true);
    setReport(null);

    try {
      // 1. Get the Analysis
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReport(data);

      // 2. Fire-and-forget the lead (Don't let this block the UI)
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, analysis: data }),
      }).catch(err => console.error("Background lead capture failed", err));

    } catch (error) {
      alert(`Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Why Isn't It Selling?</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>Enter the property address to see a live market analysis.</p>
      
      <input 
        style={{ width: "100%", padding: "15px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "15px" }}
        placeholder="e.g. 623 N Guenther Ave, New Braunfels, TX"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button 
        onClick={startAnalysis}
        disabled={loading}
        style={{ width: "100%", padding: "15px", backgroundColor: "#000", color: "#fff", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Searching Live Listings..." : "Analyze Property"}
      </button>

      {report && (
        <div style={{ marginTop: "40px", animation: "fadeIn 0.5s ease" }}>
          <h2 style={{ borderBottom: "2px solid #000", paddingBottom: "10px" }}>Market Insights</h2>
          <ul style={{ paddingLeft: "20px" }}>
            {report.reasons.map((r, i) => (
              <li key={i} style={{ marginBottom: "12px", fontSize: "17px" }}>{r}</li>
            ))}
          </ul>
          <div style={{ backgroundColor: "#f4f4f4", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
            <strong>Expert Recommendation:</strong>
            <p style={{ marginTop: "10px", lineHeight: "1.5" }}>{report.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
}
