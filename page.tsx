 "use client";

import { useState } from "react";

type Page = "home" | "matches" | "news" | "transfers" | "following";
const news = [
  ["Injury","Saka injury update","Official · Arsenal.com · Expected return: late September","official"],
  ["Transfer","Arsenal interested in Player X","Tier 1 · 3 sources · 2h ago","tier1"],
  ["Interview","Arteta speaks ahead of the weekend","Arsenal.com · 3h ago","official"],
];

export default function Home() {
  const [page,setPage] = useState<Page>("home");
  const [settings,setSettings] = useState(false);
  const [language,setLanguage] = useState("English");
  const [timezone,setTimezone] = useState("Auto-detect");

  const nav = [
    ["home","Home"],["matches","Matches"],["news","News"],["transfers","Transfers"],["following","Following"]
  ] as const;

  return <div className="app">
    <header className="top"><div className="brand">🔴 GUNNER HUB</div><button className="settingsBtn" onClick={()=>setSettings(true)}>⚙️ Settings</button></header>
    <nav>{nav.map(([id,label])=><button key={id} className={page===id?"active":""} onClick={()=>setPage(id)}>{label}</button>)}</nav>
    <main>
      <div className="breaking">🔴 <b>BREAKING</b> · Arsenal confirm latest injury update on Bukayo Saka <span>· Official · 8 min ago</span></div>
      {page==="home" && <HomePage setPage={setPage}/>}
      {page==="matches" && <MatchesPage/>}
      {page==="news" && <NewsPage/>}
      {page==="transfers" && <TransfersPage/>}
      {page==="following" && <FollowingPage/>}
    </main>
    {settings && <div className="modal"><div className="modalCard">
      <h2>⚙️ Preferences</h2>
      <label>LANGUAGE</label><div className="choices">{["English","한국어","日本語","Español"].map(x=><button className={language===x?"selected":""} onClick={()=>setLanguage(x)} key={x}>{x}</button>)}</div>
      <label>TIME ZONE</label><div className="choices">{["Auto-detect","🇬🇧 London","🇰🇷 Seoul","🇯🇵 Tokyo","🇺🇸 New York"].map(x=><button className={timezone===x?"selected":""} onClick={()=>setTimezone(x)} key={x}>{x}</button>)}</div>
      <p className="muted">Matches will always show London time and your selected local time.</p>
      <button className="save" onClick={()=>setSettings(false)}>Save</button>
    </div></div>}
  </div>
}

function HomePage({setPage}:{setPage:(p:Page)=>void}) { return <div className="grid">
  <section>
    <Card title="NEXT MATCH"><div className="match"><small>Premier League · Sat, 20 Sep</small><h2>Arsenal <em>vs</em> Chelsea</h2><p>🇬🇧 London <b>20:00</b> · 🌍 Your time <b>04:00 (+1)</b></p><button onClick={()=>setPage("matches")}>Match details</button></div></Card>
    <Card title="LATEST RESULT"><div className="match"><h2>Arsenal 3 — 1 Chelsea</h2><small>Full time · Sat, 13 Sep</small></div></Card>
    <Card title="🔄 TRANSFER WATCH"><Story title="Player X → Arsenal?" tags={["Tier 1 · Romano","Tier 1 · Sky"]} note="2 reliable sources reporting"/><Story title="Player Y linked with Arsenal" tags={["Unverified"]} note="No reliable source confirmation"/></Card>
  </section>
  <section>
    <Card title="📰 IMPORTANT UPDATES"><Story title="Saka injury update" tags={["Official"]} note="Arsenal.com · 8 min ago · Expected return: late September"/><Story title="Arsenal prepare for next league match" tags={["Tier 1"]} note="BBC Sport · 1h ago"/></Card>
    <Card title="🎥 LATEST HIGHLIGHTS"><div className="video">▶</div><p className="muted">Official Arsenal · YouTube</p></Card>
    <Card title="⭐ FOLLOWING"><p className="muted">Saka · Ødegaard · Transfers</p><b>5 new updates</b></Card>
  </section>
</div>}

function MatchesPage(){return <Card title="⚽ MATCHES"><div className="choices"><button>All</button><button>Premier League</button><button>Champions League</button><button>FA Cup</button><button>EFL Cup</button></div><MatchRow date="Sat, 20 Sep" title="Arsenal vs Chelsea" time="20:00" /><MatchRow date="Sat, 27 Sep" title="Arsenal vs Liverpool" time="17:30" /><MatchRow date="EFL Cup · Wed, 24 Sep" title="Arsenal vs Example FC" time="19:45" /><h3>Latest result</h3><MatchRow date="" title="Arsenal 3 — 1 Chelsea" time="Full time"/></Card>}

function NewsPage(){return <Card title="📰 NEWS"><div className="choices">{["All","Match","Transfer","Interview","Injury","Club","Other"].map(x=><button key={x}>{x}</button>)}</div>{news.map(n=><Story key={n[1]} title={n[1]} tags={[n[0],n[3]==="tier1"?"Tier 1":"Official"]} note={n[2]}/>)}</Card>}

function TransfersPage(){return <Card title="🔄 TRANSFER WATCH"><p className="muted">Stories are grouped by topic and show source reliability.</p><Story title="Player X → Arsenal?" tags={["Tier 1 · Romano","Tier 1 · Sky"]} note="2 reliable sources · No official confirmation"/><Story title="Player Y linked with Arsenal" tags={["Unverified"]} note="Single unverified source · Treat with caution"/></Card>}

function FollowingPage(){return <Card title="⭐ FOLLOWING"><p>Follow players, topics and keywords.</p><div className="choices">{["Saka","Ødegaard","Transfers","Injuries","Arteta"].map(x=><button key={x}>{x}</button>)}</div><h3>Your updates</h3><Story title="Saka injury update" tags={["Official"]} note="8 min ago"/><Story title="Arsenal transfer update" tags={["Tier 1"]} note="2h ago"/></Card>}

function Card({title,children}:{title:string,children:React.ReactNode}){return <div className="card"><div className="label">{title}</div>{children}</div>}
function Story({title,tags,note}:{title:string,tags:string[],note:string}){return <div className="story"><div><div className="title">{title}</div>{tags.map(t=><span className={t.toLowerCase().includes("unverified")?"tag warn":t.toLowerCase().includes("tier")?"tag tier":"tag"} key={t}>{t}</span>)}<div className="muted">{note}</div></div></div>}
function MatchRow({date,title,time}:{date:string,title:string,time:string}){return <div className="row"><div><b>{date}</b><div>{title}</div><div className="muted">🇬🇧 London {time} · 🌍 Your time {time==="Full time"?"—":"04:00 (+1)"}</div></div><button>Match</button></div>}