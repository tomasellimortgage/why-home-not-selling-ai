// Replace your Home() return with this to see the results correctly
{report && (
  <div style={{ marginTop: 40, borderTop: "3px solid #000", textAlign: "left" }}>
    <h2>6-Point Listing Analysis</h2>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0052ff' }}>
      Visual Score: {report.visualScore}/10
    </div>
    
    <h3>Diagnostic Points:</h3>
    <ul>{report.analysis?.map((item, i) => <li key={i}>{item}</li>)}</ul>

    <div style={{ background: "#f0f7ff", padding: "20px", borderRadius: "10px", borderLeft: "5px solid #0052ff" }}>
      <h4>Listing Rescue Strategy</h4>
      <p>{report.rescueStrategy}</p>
    </div>

    <div style={{ marginTop: "20px", padding: "20px", background: "#fffbe6", border: "1px solid #ffe58f" }}>
      <h4>Transition Strategy (Steve Tomaselli)</h4>
      <p>{report.steveTomaselliOffer}</p>
      <button style={{ background: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}>
        Request a Consultation with Steve
      </button>
    </div>
    
    <p style={{ marginTop: "20px", fontStyle: "italic" }}>
      <strong>In one sentence:</strong> {report.oneSentenceSummary}
    </p>
  </div>
)}
