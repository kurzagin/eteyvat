import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "./search-box";

type IconName =
  | "home"
  | "users"
  | "sword"
  | "artifact"
  | "enemy"
  | "quest"
  | "map"
  | "calendar"
  | "book"
  | "sparkles"
  | "chevron"
  | "clock"
  | "update"
  | "menu"
  | "bookmark"
  | "calculator"
  | "team"
  | "route";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 10.8 9-7 9 7" /><path d="M5 9.5V21h14V9.5M9 21v-7h6v7" /></>,
    users: <><circle cx="9" cy="7" r="3.5" /><path d="M3 20c.4-4.3 2.4-6.5 6-6.5s5.6 2.2 6 6.5M16 4.8a3.4 3.4 0 0 1 0 6.5M17 14c2.5.6 3.8 2.5 4 5.3" /></>,
    sword: <><path d="m14.5 4.5 5-1-1 5L8 19l-3 1 1-3Z" /><path d="m11 12 3 3M5 14l5 5" /></>,
    artifact: <><path d="m12 3 6 4v10l-6 4-6-4V7Z" /><path d="m12 7 3.5 2v6L12 17l-3.5-2V9Z" /></>,
    enemy: <><path d="m6 8-3-4 5 2 4-3 4 3 5-2-3 4 1 4c0 5-3 9-7 9s-7-4-7-9Z" /><path d="m9 12 2 1M15 12l-2 1M10 17h4" /></>,
    quest: <><path d="M5 3h14v18H5z" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 18h2" /></>,
    book: <><path d="M4 4h5.5A2.5 2.5 0 0 1 12 6.5V21a3 3 0 0 0-3-3H4ZM20 4h-5.5A2.5 2.5 0 0 0 12 6.5V21a3 3 0 0 1 3-3h5Z" /></>,
    sparkles: <><path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    update: <><path d="M20 11a8 8 0 1 0-2.3 6.2M20 5v6h-6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
    calculator: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" /></>,
    team: <><circle cx="12" cy="8" r="3" /><circle cx="5" cy="11" r="2" /><circle cx="19" cy="11" r="2" /><path d="M7 20c.4-4 2-6 5-6s4.6 2 5 6M1.5 19c.2-3 1.4-4.5 3.5-4.5M22.5 19c-.2-3-1.4-4.5-3.5-4.5" /></>,
    route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" /></>,
  };

  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      {paths[name]}
    </svg>
  );
}

const navigation: { label: string; icon: IconName; href: string }[] = [
  { label: "Overview", icon: "home", href: "#overview" },
  { label: "Characters", icon: "users", href: "#characters" },
  { label: "Weapons", icon: "sword", href: "#database" },
  { label: "Artifacts", icon: "artifact", href: "#database" },
  { label: "Enemies", icon: "enemy", href: "#database" },
  { label: "Quests", icon: "quest", href: "#database" },
  { label: "Regions", icon: "map", href: "#database" },
];

const domains = [
  {
    category: "Weapon Materials",
    title: "All weapon materials",
    location: "Cecilia Garden · Hidden Palace · Echoes of the Deep Tides",
    icon: "sword" as IconName,
    color: "gold",
    drops: ["D", "A", "B"],
  },
  {
    category: "Talent Materials",
    title: "All talent books",
    location: "Forsaken Rift · Taishan Mansion · Steeple of Ignorance",
    icon: "book" as IconName,
    color: "cyan",
    drops: ["F", "I", "O"],
  },
  {
    category: "Weekly Bosses",
    title: "Trounce domains",
    location: "Half-cost rewards available for the first 3 claims",
    icon: "enemy" as IconName,
    color: "violet",
    drops: ["W", "30", "3×"],
  },
];

const characters = [
  { name: "Alhaitham", role: "On-field DPS", weapon: "Sword", element: "Dendro", image: "/characters/alhaitham.png", color: "dendro", usage: "12.8%" },
  { name: "Nahida", role: "Off-field DPS", weapon: "Catalyst", element: "Dendro", image: "/characters/nahida.png", color: "dendro", usage: "68.4%" },
  { name: "Furina", role: "Support", weapon: "Sword", element: "Hydro", image: "/characters/furina.png", color: "hydro", usage: "72.1%" },
  { name: "Arlecchino", role: "On-field DPS", weapon: "Polearm", element: "Pyro", image: "/characters/arlecchino.png", color: "pyro", usage: "41.3%" },
  { name: "Neuvillette", role: "On-field DPS", weapon: "Catalyst", element: "Hydro", image: "/characters/neuvillette.png", color: "hydro", usage: "53.7%" },
];

const database = [
  { label: "Characters", count: "102", icon: "users" as IconName, color: "green" },
  { label: "Weapons", count: "214", icon: "sword" as IconName, color: "amber" },
  { label: "Artifacts", count: "56", icon: "artifact" as IconName, color: "purple" },
  { label: "Enemies", count: "339", icon: "enemy" as IconName, color: "red" },
  { label: "Quests", count: "1,244", icon: "quest" as IconName, color: "blue" },
  { label: "Regions", count: "8", icon: "map" as IconName, color: "teal" },
];

const tools = [
  { label: "Build Planner", note: "Compare equipment", icon: "sparkles" as IconName },
  { label: "Material Calculator", note: "Track total costs", icon: "calculator" as IconName },
  { label: "Team Builder", note: "Plan rotations", icon: "team" as IconName },
  { label: "Farming Routes", note: "Find local items", icon: "route" as IconName },
];

function Logo() {
  return (
    <Link className="brand" href="#overview" aria-label="E-Teyvat home">
      <span className="brand-mark"><span /></span>
      <span className="brand-copy"><strong>E-Teyvat</strong><small>Genshin Database</small></span>
    </Link>
  );
}

function SidebarContent() {
  return (
    <>
      <nav aria-label="Main navigation" className="side-nav">
        <span className="nav-label">Database</span>
        {navigation.map((item, index) => (
          <Link className={`nav-item ${index === 0 ? "active" : ""}`} href={item.href} key={item.label}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {index === 0 && <span className="nav-key">G</span>}
          </Link>
        ))}
      </nav>
      <nav aria-label="Tools" className="side-nav side-tools">
        <span className="nav-label">Your tools</span>
        <Link className="nav-item" href="#rotation"><Icon name="calendar" /><span>Daily Rotation</span></Link>
        <Link className="nav-item" href="#tools"><Icon name="bookmark" /><span>Saved Builds</span><span className="nav-badge">4</span></Link>
      </nav>
      <div className="sidebar-footer">
        <span className="live-dot" />
        <div><strong>Data up to date</strong><small>Version 5.8 · Phase II</small></div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="site-shell" id="overview">
      <header className="topbar">
        <div className="topbar-brand"><Logo /></div>
        <div className="topbar-search"><SearchBox /></div>
        <div className="topbar-actions">
          <Link className="top-link" href="#updates"><Icon name="update" />Updates</Link>
          <button className="header-icon" aria-label="Saved builds"><Icon name="bookmark" /></button>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><Icon name="menu" /></summary>
            <div className="mobile-menu-panel"><SidebarContent /></div>
          </details>
          <button className="profile-button" aria-label="Open profile">ET</button>
        </div>
      </header>

      <aside className="sidebar"><SidebarContent /></aside>

      <main className="main-content">
        <div className="content-wrap">
          <section className="page-heading">
            <div>
              <div className="breadcrumb"><span>Database</span><span>/</span><span>Overview</span></div>
              <h1>Overview</h1>
              <p>Everything you need before your next session.</p>
            </div>
            <div className="database-status">
              <span className="status-label">Current data</span>
              <strong>Version 5.8</strong>
              <span className="phase-badge">Phase II</span>
            </div>
          </section>

          <section className="quick-stats" aria-label="Database summary">
            <div><span>Characters</span><strong>102</strong><small>7 elements</small></div>
            <div><span>Weapons</span><strong>214</strong><small>5 types</small></div>
            <div><span>Artifact sets</span><strong>56</strong><small>112 bonuses</small></div>
            <div><span>Last data sync</span><strong className="sync-value"><span className="live-dot" />18 min</strong><small>Verified</small></div>
          </section>

          <section className="rotation-panel" id="rotation" aria-labelledby="rotation-title">
            <div className="panel-header">
              <div>
                <span className="panel-icon"><Icon name="calendar" size={18} /></span>
                <div><h2 id="rotation-title">Today&apos;s Rotation</h2><p>Sunday · All material domains are open</p></div>
              </div>
              <div className="reset-timer"><span>Server reset in</span><strong>07:42:18</strong></div>
            </div>
            <div className="rotation-tabs" role="tablist" aria-label="Rotation filters">
              <button className="active" role="tab" aria-selected="true">All domains</button>
              <button role="tab" aria-selected="false">Weapons</button>
              <button role="tab" aria-selected="false">Talents</button>
              <button role="tab" aria-selected="false">Bosses</button>
            </div>
            <div className="domain-grid">
              {domains.map((domain) => (
                <article className={`domain-card ${domain.color}`} key={domain.category}>
                  <div className="domain-topline">
                    <span className="domain-icon"><Icon name={domain.icon} size={19} /></span>
                    <span>{domain.category}</span>
                    <Link href="#rotation" aria-label={`View ${domain.category}`}><Icon name="chevron" size={15} /></Link>
                  </div>
                  <h3>{domain.title}</h3>
                  <p>{domain.location}</p>
                  <div className="drop-row">
                    {domain.drops.map((drop, index) => <span className={`drop-token token-${index + 1}`} key={drop}>{drop}</span>)}
                    <small>Available today</small>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="dashboard-layout">
            <div className="primary-column">
              <section className="characters-section" id="characters" aria-labelledby="characters-title">
                <div className="section-header">
                  <div><h2 id="characters-title">Popular Characters</h2><p>Most viewed builds this week</p></div>
                  <div className="element-filters" aria-label="Character filters">
                    <button className="active">All</button><button>Dendro</button><button>Hydro</button><button>Pyro</button>
                  </div>
                  <Link href="#characters">View all <Icon name="chevron" size={14} /></Link>
                </div>
                <div className="character-grid">
                  {characters.map((character) => (
                    <Link className={`character-card ${character.color}`} href="#characters" key={character.name}>
                      <div className="character-image">
                        <span className="element-orb" aria-label={character.element}>{character.element.charAt(0)}</span>
                        <span className="usage-badge">{character.usage}</span>
                        <Image alt={`${character.name} character portrait`} fill sizes="(max-width: 600px) 46vw, (max-width: 1100px) 25vw, 180px" src={character.image} />
                        <div className="stars">★★★★★</div>
                      </div>
                      <div className="character-data">
                        <h3>{character.name}</h3>
                        <p>{character.element} · {character.weapon}</p>
                        <span>{character.role}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="database-section" id="database" aria-labelledby="database-title">
                <div className="section-header">
                  <div><h2 id="database-title">Browse Database</h2><p>Jump directly to any collection</p></div>
                </div>
                <div className="database-grid">
                  {database.map((item) => (
                    <Link className="database-card" href={item.label === "Characters" ? "#characters" : "#database"} key={item.label}>
                      <span className={`database-icon ${item.color}`}><Icon name={item.icon} size={20} /></span>
                      <span><strong>{item.label}</strong><small>{item.count} entries</small></span>
                      <Icon name="chevron" size={15} />
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <aside className="right-rail">
              <section className="tools-panel" id="tools">
                <div className="rail-header"><div><h2>Quick Tools</h2><p>Plan your next upgrade</p></div></div>
                <div className="tool-list">
                  {tools.map((tool) => (
                    <Link href="#tools" className="tool-card" key={tool.label}>
                      <span><Icon name={tool.icon} size={18} /></span>
                      <div><strong>{tool.label}</strong><small>{tool.note}</small></div>
                      <Icon name="chevron" size={14} />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="updates-panel" id="updates">
                <div className="rail-header"><div><h2>Recently Updated</h2><p>Latest database changes</p></div><Link href="#updates">See all</Link></div>
                <div className="update-list">
                  <Link href="#characters"><span className="update-icon dendro">D</span><div><strong>Alhaitham build</strong><small>Team recommendations revised</small></div><time>2h</time></Link>
                  <Link href="#database"><span className="update-icon artifact"><Icon name="artifact" size={16} /></span><div><strong>Night of the Sky&apos;s Unveiling</strong><small>Set rankings added</small></div><time>5h</time></Link>
                  <Link href="#rotation"><span className="update-icon boss"><Icon name="enemy" size={16} /></span><div><strong>Weekly boss drops</strong><small>Material data verified</small></div><time>1d</time></Link>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 4).map((item, index) => (
          <Link className={index === 0 ? "active" : ""} href={item.href} key={item.label}><Icon name={item.icon} size={19} /><span>{item.label}</span></Link>
        ))}
      </nav>
    </div>
  );
}
