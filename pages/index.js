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
      // CRITICAL: Ensure this points to /api/analyze
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      const data = await res.json();
      setReport(data);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Home Analysis Bot</h1>
      <input 
        style={{ width: "100%", padding: "12px", fontSize: "16px" }}
        placeholder="Enter address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button 
        onClick={startAnalysis} 
        disabled={loading}
        style={{ width: "100%", marginTop: "10px", padding: "15px", backgroundColor: "#000", color: "#fff", cursor: "pointer" }}
      >
        {loading ? "AI Researching Market..." : "Analyze Property"}
      </button>

      {report && (
        <div style={{ marginTop: "40px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
          <h2>Diagnostic Results</h2>
          {/* We use a cleaner display here now that the connection is confirmed */}
          {report.reasons ? (
            <>
              <ul>{report.reasons.map((r, i) => <li key={i} style={{marginBottom: '8px'}}>{r}</li>)}</ul>
              <div style={{marginTop: '20px', padding: '15px', background: '#eee'}}>
                <strong>Recommendation:</strong>
                <p>{report.recommendations}</p>
              </div>
            </>
          ) : (
            <pre>{JSON.stringify(report, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
