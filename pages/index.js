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
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      
      setReport(data);

      // Background lead capture
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, report: data }),
      }).catch(e => console.error("Lead sync failed", e));

    } catch (error) {
      alert(`Oops: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontWeight: "800", fontSize: "2.5rem" }}>Why Isn't It Selling?</h1>
      <p style={{ color: "#555" }}>We'll search the internet to find your listing and analyze the market data.</p>
      
      <input 
        style={{ width: "100%", padding: "16px", fontSize: "18px", borderRadius: "12px", border: "2px solid #eee", marginTop: "20px" }}
        placeholder="623 N Guenther Ave, New Braunfels, TX"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button 
        onClick={startAnalysis}
        disabled={loading}
        style={{ width: "100%", padding: "16px", backgroundColor: "#000", color: "#fff", borderRadius: "12px", marginTop: "15px", cursor: "pointer", fontWeight: "bold" }}
      >
        {loading ? "AI is Researching the Web..." : "Analyze My Home"}
      </button>

      {/* SAFETY CHECK: report?.reasons prevents the 'Application Error' crash */}
      {report && report.reasons && (
        <div style={{ marginTop: "50px", borderTop: "2px solid #000", paddingTop: "30px" }}>
          <h2>Listing Diagnostic</h2>
          <ul style={{ lineHeight: "1.8" }}>
            {report.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <div style={{ padding: "20px", background: "#f0f0f0", borderRadius: "10px", marginTop: "20px" }}>
            <strong>Expert Verdict:</strong>
            <p>{report.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
}
