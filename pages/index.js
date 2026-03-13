import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");

  async function analyze() {
    if (!url) {
      alert("Please paste a listing URL first.");
      return;
    }

    setLoading(true);
    setRaw("");
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const text = await res.text();
      setRaw(text);

      if (!res.ok) {
        setError(`Request failed: ${res.status}`);
      }
    } catch (err) {
      setError(err?.message || "Unknown browser error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: 800,
        margin: "50px auto",
        padding: 20,
      }}
    >
      <h1>Why Isn’t My Home Selling?</h1>

      <p>Paste your Zillow or MLS listing link.</p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste listing URL"
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
          fontSize: 16,
        }}
      />

      <button
        type="button"
        onClick={analyze}
        style={{
          padding: "12px 18px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Analyze Listing
      </button>

      {loading && <p style={{ marginTop: 20 }}>Analyzing listing...</p>}

      {error && (
        <div
          style={{
            marginTop: 20,
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <h2>Raw API Response</h2>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#f5f5f5",
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            minHeight: 120,
          }}
        >
          {raw || "No response yet."}
        </pre>
      </div>

      <hr style={{ marginTop: 40 }} />

      <h3>Want a second opinion from a local expert?</h3>

      <form action="/api/lead" method="POST">
        <input
          name="name"
          placeholder="Name"
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="email"
          placeholder="Email"
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="phone"
          placeholder="Phone"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input type="hidden" name="listing" value={url} />

        <button
          type="submit"
          style={{
            padding: "12px 18px",
            cursor: "pointer",
          }}
        >
          Connect with a Local Expert
        </button>
      </form>
    </div>
  );
}
