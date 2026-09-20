"use client";

import { useEffect, useState } from "react";

type Match = {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
  };
  league: {
    name: string;
    round: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
};

export default function Home() {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatch() {
      try {
        const response = await fetch("/api/matches");

        if (!response.ok) {
          throw new Error("Failed to load match");
        }

        const data = await response.json();

        if (!data.response || data.response.length === 0) {
          throw new Error("No upcoming Arsenal match found");
        }

        setMatch(data.response[0]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, []);

  const formatTime = (date: string, timeZone: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#d71920",
          color: "white",
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong style={{ fontSize: "22px" }}>🔴 GOONER HUB</strong>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ⚙️
        </button>
      </header>

      <nav
        style={{
          background: "white",
          display: "flex",
          gap: "24px",
          padding: "14px 24px",
          borderBottom: "1px solid #ddd",
          fontWeight: "600",
        }}
      >
        <span>Home</span>
        <span>Matches</span>
        <span>News</span>
        <span>Following</span>
      </nav>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "24px 16px 60px",
        }}
      >
        <div
          style={{
            background: "#111",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          🔴 BREAKING · Gooner Hub is now connected to live football data
        </div>

        <section
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#777",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Next Match
          </div>

          {loading && (
            <div style={{ padding: "30px 0", fontSize: "18px" }}>
              Loading Arsenal&apos;s next match...
            </div>
          )}

          {error && (
            <div style={{ color: "#c00", padding: "20px 0" }}>
              Could not load match data: {error}
            </div>
          )}

          {match && (
            <>
              <div
                style={{
                  textAlign: "center",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                {match.league.name}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "35px",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "150px" }}>
                  <img
                    src={match.teams.home.logo}
                    alt={match.teams.home.name}
                    width="70"
                    height="70"
                  />
                  <div
                    style={{
                      marginTop: "10px",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {match.teams.home.name}
                  </div>
                </div>

                <div style={{ fontSize: "24px", fontWeight: "700" }}>
                  VS
                </div>

                <div style={{ width: "150px" }}>
                  <img
                    src={match.teams.away.logo}
                    alt={match.teams.away.name}
                    width="70"
                    height="70"
                  />
                  <div
                    style={{
                      marginTop: "10px",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {match.teams.away.name}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "28px",
                  paddingTop: "20px",
                  borderTop: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "17px" }}>
                  🇬🇧 London time
                </div>

                <div style={{ marginTop: "6px", color: "#555" }}>
                  {formatTime(match.fixture.date, "Europe/London")}
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    fontWeight: "700",
                    fontSize: "17px",
                  }}
                >
                  🌍 Your local time
                </div>

                <div style={{ marginTop: "6px", color: "#555" }}>
                  {formatTime(
                    match.fixture.date,
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  )}
                </div>
              </div>
            </>
          )}
        </section>

        <section
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Latest News</h2>

          <div style={{ padding: "14px 0", borderBottom: "1px solid #eee" }}>
            <strong>Match data connected</strong>
            <div style={{ color: "#777", marginTop: "5px" }}>
              Live Arsenal fixtures are now being provided by API-Football.
            </div>
          </div>

          <div style={{ padding: "14px 0" }}>
            <strong>More Arsenal news coming soon</strong>
            <div style={{ color: "#777", marginTop: "5px" }}>
              News sources will be connected next.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
