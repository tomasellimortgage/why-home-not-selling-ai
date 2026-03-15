import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState(""); // New status tracker
  const [loading, setLoading] = useState(false);

  async function startAnalysis() {
    if (!address) return alert("Please enter an address.");
    setLoading(true);
    setReport(null);
    setStatus("Searching the internet for your home...");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      setStatus("Processing market data...");
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.details || "The search failed.");
      
      setReport(data);
      setStatus("Analysis complete!");
    } catch (error) {
      console.error(error);
      setStatus("");
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Home Analysis Bot</h1>
      <input 
        style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
        placeholder="Enter address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button 
        onClick={startAnalysis} 
        disabled={loading}
        style={{ width: "100%", padding: "12px", cursor: "pointer", backgroundColor: "#000", color: "#fff" }}
      >
        {loading ? "Working..." : "Analyze Home"}
      </button>

      {/* This helps you see where it's getting stuck */}
      {loading && <p style={{ color: "blue", marginTop: "10px" }}>{status}</p>}

      {report && (
        <div style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9" }}>
          <h2>Results</h2>
          <ul>
            {report.reasons?.map((r, i) => <li key={i}>{r}</li>) || <li>No reasons found.</li>}
          </ul>
          <p><strong>Recommendation:</strong> {report.recommendations || "No recommendation available."}</p>
        </div>
      )}
    </div>
  );
}
