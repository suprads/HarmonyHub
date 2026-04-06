"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [serverStatus, setServerStatus] = useState<string>("checking...");
  const [cookie, setCookie] = useState("");
  const [authorization, setAuthorization] = useState("");
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/ytmusic/health")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setServerStatus(`${data.status}`))
      .catch((err) => setServerStatus(`Unreachable: ${err.message}`));
  }, []);

  async function fetchTopTracks() {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/ytmusic/top-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers: {
            cookie,
            authorization: authorization || null,
          },
          limit: 100,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Status ${res.status}`);
      }

      setResults(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ padding: "2rem", maxWidth: "700px", fontFamily: "monospace" }}
    >
      <h1>YTMusic API Test</h1>
      <p>Server: {serverStatus}</p>

      <hr />

      <label>
        <strong>Cookie</strong>
        <textarea
          rows={4}
          style={{ width: "100%", marginTop: "0.5rem" }}
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
          placeholder="Cookie header"
        />
      </label>

      <br />

      <label>
        <strong>Authorization</strong> (SAPISIDHASH value)
        <input
          type="text"
          style={{ width: "100%", marginTop: "0.5rem" }}
          value={authorization}
          onChange={(e) => setAuthorization(e.target.value)}
          placeholder="SAPISIDHASH ..."
        />
      </label>

      <br />
      <br />

      <button onClick={fetchTopTracks} disabled={!cookie || loading}>
        {loading ? "Fetching..." : "Fetch Top Tracks"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {results && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Results ({results.count} tracks)</h3>
          {results.tracks.map((track: any, index: number) => (
            <div key={index}>
              <p>
                <strong>{track.title}</strong> by {track.artist}
              </p>
              {track.thumbnails && track.thumbnails[0] && (
                <img src={track.thumbnails[0].url} alt="Album Art" />
              )}
            </div>
          ))}
          {/*  <pre style={{ overflow: "auto", maxHeight: "400px" }}>
            {JSON.stringify(results.tracks, null, 2)}
          </pre>*/}
        </div>
      )}
    </div>
  );
}
