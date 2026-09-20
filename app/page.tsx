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
    round?: string;
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

type Tab = "home" | "matches" | "news" | "following";

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState("All");

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch("/api/matches");

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to load match data");
        }

        const data = await response.json();
        setMatches(data.response || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load match data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const nextMatch = matches[0];

 function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  }).format(new Date(dateString));
}

function formatLocalTime(dateString: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateString));
}

  function renderNextMatch() {
    if (loading) {
      return <p>Loading Arsenal's next match...</p>;
    }

    if (error) {
      return <p style={{ color: "red" }}>Could not load match data: {error}</p>;
    }

    if (!nextMatch) {
      return <p>No upcoming Arsenal match found.</p>;
    }

    return (
      <div>
        <div style={{ textAlign: "center", color: "#666", marginBottom: 20 }}>
          {nextMatch.league.name}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 60,
          }}
        >
          <Team
            name={nextMatch.teams.home.name}
            logo={nextMatch.teams.home.logo}
          />

          <strong style={{ fontSize: 28 }}>VS</strong>

          <Team
            name={nextMatch.teams.away.name}
            logo={nextMatch.teams.away.logo}
          />
        </div>

        <div
          style={{
            marginTop: 30,
            paddingTop: 20,
            borderTop: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <strong>🇬🇧 London time</strong>
          <div style={{ marginTop: 8, color: "#666" }}>
            {formatDate(nextMatch.fixture.date)}
          </div>

          <div style={{ marginTop: 20 }}>
            <strong>🌍 Your local time</strong>
            <div style={{ marginTop: 8, color: "#666" }}>
              {formatLocalTime(nextMatch.fixture.date)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderHome() {
    return (
      <>
        <SectionTitle title="NEXT MATCH" />
        <Card>{renderNextMatch()}</Card>

        <Card>
          <h2>Latest News</h2>

          <NewsItem
            title="Arsenal match data connected"
            description="Live Arsenal fixtures are now being provided by football-data.org."
          />

          <NewsItem
            title="More Arsenal news coming soon"
            description="News sources will be connected next."
          />
        </Card>
      </>
    );
  }

  function renderMatches() {
  const competitions = [
    "All",
    "Premier League",
    "Champions League",
    "FA Cup",
    "EFL Cup",
  ];

  const filteredMatches =
    selectedCompetition === "All"
      ? matches
      : matches.filter(
          (match) => match.league.name === selectedCompetition
        );

  const now = new Date();

  const upcomingMatches = filteredMatches.filter(
    (match) => new Date(match.fixture.date) >= now
  );

  const completedMatches = filteredMatches.filter(
    (match) => new Date(match.fixture.date) < now
  );

  const MatchCard = ({ match }: { match: Match }) => (
    <div
      onClick={() =>
        alert(
          `${match.teams.home.name} vs ${match.teams.away.name}\n\nMatch detail coming soon`
        )
      }
      style={{
        padding: "20px 0",
        borderBottom: "1px solid #eee",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <div style={{ color: "#666", marginBottom: 10 }}>
        {match.league.name}
      </div>

      <strong>
        {match.teams.home.name} vs {match.teams.away.name}
      </strong>

      <div style={{ marginTop: 8, color: "#666" }}>
        🇬🇧 {formatDate(match.fixture.date)}
      </div>

      <div style={{ color: "#666" }}>
        🌍 {formatLocalTime(match.fixture.date)}
      </div>
    </div>
  );

  return (
    <>
      <SectionTitle title="MATCHES" />

      <Card>
        <h2>Arsenal Fixtures</h2>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            margin: "20px 0",
          }}
        >
          {competitions.map((competition) => (
            <button
              key={competition}
              onClick={() => setSelectedCompetition(competition)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border:
                  selectedCompetition === competition
                    ? "1px solid #e30613"
                    : "1px solid #ddd",
                background:
                  selectedCompetition === competition
                    ? "#e30613"
                    : "white",
                color:
                  selectedCompetition === competition
                    ? "white"
                    : "#111",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {competition}
            </button>
          ))}
        </div>

        {loading && <p>Loading matches...</p>}

        {error && (
          <p style={{ color: "red" }}>
            Could not load match data: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <h3 style={{ marginTop: 30 }}>Upcoming</h3>

            {upcomingMatches.length === 0 && (
              <p style={{ color: "#777" }}>
                No upcoming matches found.
              </p>
            )}

            {upcomingMatches.map((match) => (
              <MatchCard key={match.fixture.id} match={match} />
            ))}

            <h3 style={{ marginTop: 40 }}>Results</h3>

            {completedMatches.length === 0 && (
              <p style={{ color: "#777" }}>
                No completed matches found.
              </p>
            )}

            {completedMatches.map((match) => (
              <MatchCard key={match.fixture.id} match={match} />
            ))}
          </>
        )}
      </Card>
    </>
  );
}

  function renderNews() {
    return (
      <>
        <SectionTitle title="NEWS" />

        <Card>
          <h2>Latest Arsenal News</h2>

          <NewsItem
            title="News centre coming soon"
            description="Arsenal news from approved sources will appear here."
          />

          <NewsItem
            title="Transfer Watch"
            description="Transfer stories will be grouped and shown with source reliability."
          />

          <NewsItem
            title="Injury Updates"
            description="Player injury updates will appear here."
          />
        </Card>
      </>
    );
  }

  function renderFollowing() {
    return (
      <>
        <SectionTitle title="FOLLOWING" />

        <Card>
          <h2>Your Following</h2>

          <p style={{ color: "#666" }}>
            Follow players and topics to see personalised Arsenal updates here.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            {["Saka", "Ødegaard", "Transfers", "Injuries", "Arteta"].map(
              (item) => (
                <button
                  key={item}
                  style={tagStyle}
                  onClick={() => alert(`${item} following coming soon`)}
                >
                  + {item}
                </button>
              )
            )}
          </div>
        </Card>
      </>
    );
  }

  function renderContent() {
    if (activeTab === "matches") return renderMatches();
    if (activeTab === "news") return renderNews();
    if (activeTab === "following") return renderFollowing();

    return renderHome();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header
        style={{
          background: "#e30613",
          color: "white",
          padding: "28px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26 }}>🔴 GOONER HUB</h1>

        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
          }}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </header>

      <nav
        style={{
          background: "white",
          padding: "0 32px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: 30,
        }}
      >
        {(
          [
            ["home", "Home"],
            ["matches", "Matches"],
            ["news", "News"],
            ["following", "Following"],
          ] as [Tab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "18px 0",
              fontSize: 16,
              fontWeight: activeTab === tab ? 700 : 600,
              cursor: "pointer",
              color: activeTab === tab ? "#e30613" : "#111",
              borderBottom:
                activeTab === tab
                  ? "3px solid #e30613"
                  : "3px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {settingsOpen && (
        <div
          style={{
            background: "white",
            borderBottom: "1px solid #ddd",
            padding: 24,
            textAlign: "right",
          }}
        >
          <strong>Settings</strong>
          <p style={{ marginBottom: 0, color: "#666" }}>
            Language and timezone settings coming soon.
          </p>
        </div>
      )}

      {activeTab === "home" && (
        <div
          style={{
            maxWidth: 900,
            margin: "24px auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              background: "#111",
              color: "white",
              padding: "14px 18px",
              borderRadius: 10,
              marginBottom: 22,
              fontWeight: 700,
            }}
          >
            🔴 GOONER HUB · Live Arsenal data connected
          </div>

          {renderContent()}
        </div>
      )}

      {activeTab !== "home" && (
        <div
          style={{
            maxWidth: 900,
            margin: "24px auto",
            padding: "0 20px",
          }}
        >
          {renderContent()}
        </div>
      )}
    </main>
  );
}

function Team({ name, logo }: { name: string; logo: string }) {
  return (
    <div style={{ textAlign: "center", width: 150 }}>
      <img
        src={logo}
        alt={name}
        style={{
          width: 70,
          height: 70,
          objectFit: "contain",
        }}
      />
      <div style={{ marginTop: 10, fontWeight: 700 }}>{name}</div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#777",
        marginBottom: 10,
        letterSpacing: 0.5,
      }}
    >
      {title}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "white",
        borderRadius: 14,
        padding: 26,
        marginBottom: 22,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </section>
  );
}

function NewsItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong>{title}</strong>
      <div style={{ color: "#777", marginTop: 5 }}>{description}</div>
    </div>
  );
}

const tagStyle = {
  border: "1px solid #ddd",
  background: "white",
  borderRadius: 20,
  padding: "8px 14px",
  cursor: "pointer",
};
