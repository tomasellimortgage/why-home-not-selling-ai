import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!address) return alert("Enter an address first!");
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      
      setReport(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "100px auto", textAlign: "center", fontFamily: "Arial" }}>
      <h1>Why Isn't It Selling?</h1>
      <p>Enter address to search the web for your listing:</p>
      
      <input 
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 8, border: "1px solid #ddd" }}
        placeholder="123 Main St, New York, NY"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button 
        onClick={handleAnalyze}
        disabled={loading}
        style={{ width: "100%", marginTop: 15, padding: 15, backgroundColor: "#0052ff", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}
      >
        {loading ? "Searching the Internet..." : "Analyze My Home"}
      </button>

      {report && (
        <div style={{ marginTop: 40, textAlign: "left", padding: 20, backgroundColor: "#f4f7ff", borderRadius: 12 }}>
          <h2 style={{ color: "#0052ff" }}>Analysis Results</h2>
          <ul style={{ lineHeight: "1.6" }}>
            {report.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <hr />
          <h3>Recommendation</h3>
          <p>{report.recommendations}</p>
        </div>
      )}
    </div>
  );
}
