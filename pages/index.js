import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [report, setReport] = useState(null); // This was missing/broken
  const [loading, setLoading] = useState(false);

  async function startAnalysis() {
    if (!address) return alert("Please enter the property address.");
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
    } catch (error) {
      alert(`Diagnostic Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 650, margin: "60px auto", padding: "20px", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h1 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>Why Hasn't My Home Sold?</h1>
      <p style={{ color: "#555" }}>Senior Real Estate Listing Diagnostic — Powered by Steve Tomaselli</p>
      
      <input 
        style={{ width: "100%", padding: "15px", fontSize: "18px", borderRadius: "10px", border: "2px solid #ddd", marginTop: "20px" }}
        placeholder="Enter Address (City, State, Zip)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button 
        onClick={startAnalysis}
        disabled={loading}
        style={{ width: "100%", padding: "16px", backgroundColor: "#000", color: "#fff", borderRadius: "10px", marginTop: "15px", cursor: "pointer", fontWeight: "bold", fontSize: "18px" }}
      >
        {loading ? "AI Senior Strategist Researching..." : "Start Listing Diagnostic"}
      </button>

      {/* The ?. checks prevent the 'report is not defined' error */}
      {report && (
        <div style={{ marginTop: "50px", borderTop: "3px solid #000", paddingTop: "30px" }}>
          <h2 style={{ textTransform: "uppercase", letterSpacing: "1px" }}>6-Point Listing Analysis</h2>
          
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0052ff', marginBottom: '20px' }}>
            Visual Presentation Score: {report?.visualScore || 0}/10
          </div>
          
          <ul style={{ paddingLeft: "20px" }}>
            {report?.analysis?.map((point, i) => (
              <li key={i} style={{ marginBottom: "12px", fontSize: "17px" }}>{point}</li>
            ))}
          </ul>

          <div style={{ background: "#f0f7ff", padding: "25px", borderRadius: "12px", borderLeft: "6px solid #0052ff", marginTop: "30px" }}>
            <h3 style={{ marginTop: 0 }}>Listing Rescue Strategy</h3>
            <p style={{ fontSize: "18px" }}>{report?.rescueStrategy}</p>
          </div>

          <div style={{ marginTop: "30px", padding: "25px", background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: "12px" }}>
            <h3 style={{ marginTop: 0 }}>Transition Strategy (Steve Tomaselli)</h3>
            <p>{report?.steveTomaselliOffer}</p>
            <button style={{ backgroundColor: "#28a745", color: "white", padding: "12px 24px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
              Request Consultation with Steve
            </button>
          </div>
          
          <p style={{ marginTop: "30px", fontSize: "1.2rem", fontWeight: "bold", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            Summary: {report?.oneSentenceSummary}
          </p>
        </div>
      )}
    </div>
  );
}
