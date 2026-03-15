import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function startAnalysis() {
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      setReport(data);
    } catch (e) {
      alert("System Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "100px auto", fontFamily: "sans-serif" }}>
      {/* CHANGE THIS TITLE TO TEST DEPLOYMENT */}
      <h1>DIAGNOSTIC MODE v2</h1> 
      <input 
        style={{ width: "100%", padding: 10 }}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Address"
      />
      <button onClick={startAnalysis} style={{ width: "100%", marginTop: 10, padding: 10 }}>
        {loading ? "Searching..." : "Run Diagnostic"}
      </button>

      {report && (
        <div style={{ marginTop: 20, background: "#eee", padding: 20 }}>
          <h3>Results:</h3>
          {/* This logic forces the display of whatever the AI sends back */}
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
