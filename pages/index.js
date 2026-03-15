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
      // 1. POINT TO THE ANALYZE ENDPOINT
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.details || "AI Search failed");
      
      setReport(data);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontWeight: "800" }}>Home Listing Diagnostic</h1>
      <p style={{ color: "#666" }}>AI will search for ${address || 'the property'} and analyze market flaws.</p>
      
      <input 
        style={{ width: "100%", padding: "15px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ddd" }}
        placeholder="Enter address (e.g. 123 Main St, Austin, TX)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button 
        onClick={startAnalysis} 
        disabled={loading}
        style={{ width: "100%", marginTop: "10px", padding: "15px", backgroundColor: "#000", color: "#fff", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
      >
        {loading ? "AI is Searching the Web..." : "Run Analysis"}
      </button>

      {report && (
        <div style={{ marginTop: "40px", borderTop: "2px solid #000", paddingTop: "20px" }}>
          <h2>Listing Report</h2>
          <ul>
            {report.reasons?.map((r, i) => (
              <li key={i} style={{ marginBottom: "10px", fontSize: "17px" }}>{r}</li>
            ))}
          </ul>
          <div style={{ padding: "20px", background: "#f4f4f4", borderRadius: "8px", marginTop: "20px" }}>
            <strong>Expert Recommendation:</strong>
            <p style={{ marginTop: "10px" }}>{report.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
}
