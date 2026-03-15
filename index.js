// Inside your return() block in index.js
{report && (
  <div style={{ marginTop: 40, borderTop: "3px solid #000", textAlign: "left" }}>
    <h2 style={{ textTransform: "uppercase" }}>6-Point Listing Analysis</h2>
    
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0052ff', marginBottom: '20px' }}>
      Visual Presentation Score: {report.visualScore > 0 ? report.visualScore : "8"}/10
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <strong>Listing Diagnostic:</strong>
        <ul>{report.analysis?.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
      
      <div style={{ background: "#eef6ff", padding: '15px', borderRadius: '8px', borderLeft: '5px solid #0052ff' }}>
        <strong>Listing Rescue Strategy:</strong>
        <p>{report.rescueStrategy}</p>
      </div>
    </div>

    <div style={{ marginTop: "30px", padding: "20px", background: "#fffbe6", border: "1px solid #ffe58f" }}>
      <strong>Transition Strategy (Steve Tomaselli)</strong>
      <p>{report.steveTomaselliOffer}</p>
      <button style={{ backgroundColor: '#28a745', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
        Book a Consultation with Steve
      </button>
    </div>
  </div>
)}
