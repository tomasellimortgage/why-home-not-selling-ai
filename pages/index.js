
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({url})
    });
    const data = await res.json();
    setReport(data);
    setLoading(false);
  }

  return (
    <div style={{fontFamily:"Arial", maxWidth:700, margin:"40px auto"}}>
      <h1>Why Isn’t My Home Selling?</h1>
      <p>Paste your Zillow or MLS listing link.</p>
      <input
        value={url}
        onChange={e=>setUrl(e.target.value)}
        style={{width:"100%", padding:10}}
        placeholder="Paste listing URL"
      />
      <button onClick={analyze} style={{marginTop:10,padding:10}}>Analyze Listing</button>

      {loading && <p>Analyzing listing...</p>}

      {report && (
        <div style={{marginTop:30}}>
          <h2>Top Reasons Your Home May Not Be Selling</h2>
          <ul>
            {report.reasons.map((r,i)=>(<li key={i}>{r}</li>))}
          </ul>

          <h3>Recommendations</h3>
          <p>{report.recommendations}</p>

          <hr/>

          <h3>Want a second opinion from a local expert?</h3>
          <form action="/api/lead" method="POST">
            <input name="name" placeholder="Name" required /><br/>
            <input name="email" placeholder="Email" required /><br/>
            <input name="phone" placeholder="Phone" /><br/>
            <input type="hidden" name="listing" value={url}/>
            <button type="submit">Connect with a Local Expert</button>
          </form>
        </div>
      )}
    </div>
  );
}
