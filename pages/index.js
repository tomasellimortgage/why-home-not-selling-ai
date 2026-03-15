import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!address) return alert("Please enter an address.");
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }), // Sending address now
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      
      setReport(data);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Why Isn’t My Home Selling?</h1>
      <p>Enter your full property address:</p>
      <input 
        style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 5, border: "1px solid #ccc" }}
        placeholder="123 Main St, New Braunfels, TX"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button 
        onClick={analyze} 
        disabled={loading} 
        style={{ width: "100%", padding: 12, backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}
      >
        {loading ? "Searching Listings..." : "Analyze My Home"}
      </button>

      {report && (
        <div style={{ marginTop: 40, padding: 20, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
          <h2>Listing Analysis</h2>
          <ul>{report.reasons.map((r, i) => <li key={i} style={{ marginBottom: 10 }}>{r}</li>)}</ul>
          <h3>Expert Recommendation</h3>
          <p>{report.recommendations}</p>
        </div>
      )}
    </div>
  );
}
