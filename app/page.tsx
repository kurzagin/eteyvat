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
  | "bookmark";

function Icon({
  name,
  size = 18,
}: {
  name: IconName;
  size?: number;
}) {
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
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

const navigation: { label: string; icon: IconName; href: string }[] = [
  { label: "Overview", icon: "home", href: "#overview" },
  { label: "Characters", icon: "users", href: "#characters" },
  { label: "Weapons", icon: "sword", href: "#collections" },
  { label: "Artifacts", icon: "artifact", href: "#collections" },
  { label: "Enemies", icon: "enemy", href: "#collections" },
  { label: "Quests", icon: "quest", href: "#collections" },
  { label: "Regions", icon: "map", href: "#collections" },
];

const collections: {
  label: string;
  count: string;
  note: string;
  icon: IconName;
  tint: string;
}[] = [
  { label: "Characters", count: "102 entries", note: "Builds, talents & teams", icon: "users", tint: "jade" },
  { label: "Weapons", count: "214 entries", note: "Stats, passives & materials", icon: "sword", tint: "gold" },
  { label: "Artifacts", count: "56 sets", note: "Bonuses & recommendations", icon: "artifact", tint: "violet" },
  { label: "Enemies", count: "339 entries", note: "Drops, routes & resistances", icon: "enemy", tint: "crimson" },
  { label: "Quests", count: "1,244 entries", note: "Requirements & rewards", icon: "quest", tint: "blue" },
  { label: "Regions", count: "8 regions", note: "Exploration & local resources", icon: "map", tint: "sand" },
];

const characters = [
  { name: "Alhaitham", role: "Dendro · Sword", letter: "A", color: "emerald", status: "Updated" },
  { name: "Nahida", role: "Dendro · Catalyst", letter: "N", color: "lime", status: "Popular" },
  { name: "Furina", role: "Hydro · Sword", letter: "F", color: "azure", status: "Updated" },
  { name: "Arlecchino", role: "Pyro · Polearm", letter: "A", color: "red", status: "Popular" },
  { name: "Neuvillette", role: "Hydro · Catalyst", letter: "N", color: "indigo", status: "Guide" },
];

const domains = [
  {
    name: "Weapon Ascension",
    places: "Cecilia Garden · Hidden Palace",
    items: ["All weapon materials", "Sunday availability"],
    icon: "sword" as IconName,
    color: "gold",
  },
  {
    name: "Talent Materials",
    places: "Forsaken Rift · Taishan Mansion",
    items: ["All talent books", "Sunday availability"],
    icon: "book" as IconName,
    color: "blue",
  },
  {
    name: "Artifact Domains",
    places: "All regions",
    items: ["No daily restriction", "View recommended sets"],
    icon: "artifact" as IconName,
    color: "violet",
  },
];

function Logo() {
  return (
    <Link className="brand" href="#overview" aria-label="E-Teyvat home">
      <span className="brand-mark">
        <span />
      </span>
      <span className="brand-name">E-Teyvat</span>
      <span className="brand-edition">Archive</span>
    </Link>
  );
}

function SidebarContent() {
  return (
    <>
      <nav aria-label="Main navigation" className="side-nav">
        <p className="nav-label">Knowledge base</p>
        {navigation.map((item, index) => (
          <Link
            className={`nav-item ${index === 0 ? "active" : ""}`}
            href={item.href}
            key={item.label}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {index === 0 && <span className="active-marker" />}
          </Link>
        ))}
      </nav>
      <div className="sidebar-rule" />
      <nav aria-label="Tools" className="side-nav utility-nav">
        <p className="nav-label">Tools</p>
        <Link className="nav-item" href="#rotation"><Icon name="calendar" /><span>Daily Materials</span></Link>
        <Link className="nav-item" href="#characters"><Icon name="bookmark" /><span>Saved Builds</span><span className="nav-count">4</span></Link>
      </nav>
      <div className="sidebar-footer">
        <div className="data-status"><span className="status-dot" />Data verified</div>
        <p>Archive index · v5.8</p>
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
          <Link className="text-action" href="#updates"><Icon name="update" />Updates</Link>
          <button className="icon-button" aria-label="View saved pages"><Icon name="bookmark" /></button>
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
          <section className="page-heading" aria-labelledby="page-title">
            <div>
              <div className="eyebrow"><span>E-Teyvat</span><Icon name="chevron" size={12} /><span>Overview</span></div>
              <h1 id="page-title">Teyvat Knowledge Base</h1>
              <p>Builds, materials, and game data—organized for quick reference.</p>
            </div>
            <div className="last-updated"><Icon name="clock" size={15} />Updated July 26, 2026</div>
          </section>

          <section className="rotation-section" id="rotation" aria-labelledby="rotation-title">
            <div className="section-heading">
              <div>
                <div className="section-kicker"><Icon name="calendar" size={15} />Daily reference</div>
                <h2 id="rotation-title">Today’s Rotation</h2>
              </div>
              <div className="day-switcher" aria-label="Selected day">
                <span>Sun</span>
                <strong>July 26</strong>
              </div>
            </div>
            <div className="sunday-note">
              <span className="sun-symbol">✦</span>
              <div>
                <strong>All material domains are available today</strong>
                <p>Sunday lets you choose from every weapon and talent material reward.</p>
              </div>
              <Link href="#collections">View all domains <Icon name="chevron" size={14} /></Link>
            </div>
            <div className="domain-grid">
              {domains.map((domain) => (
                <article className="domain-card" key={domain.name}>
                  <div className={`domain-icon ${domain.color}`}><Icon name={domain.icon} size={20} /></div>
                  <div className="domain-card-content">
                    <h3>{domain.name}</h3>
                    <p>{domain.places}</p>
                    <div className="domain-meta">
                      {domain.items.map((item, index) => (
                        <span key={item} className={index === 0 ? "primary-meta" : ""}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <Link href="#collections" aria-label={`View ${domain.name}`}><Icon name="chevron" size={16} /></Link>
                </article>
              ))}
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="collection-section" id="collections" aria-labelledby="collection-title">
              <div className="section-title-row">
                <div>
                  <span className="section-kicker">Browse the archive</span>
                  <h2 id="collection-title">Collections</h2>
                </div>
              </div>
              <div className="collection-grid">
                {collections.map((item) => (
                  <Link className="collection-card" href={item.label === "Characters" ? "#characters" : "#collections"} key={item.label}>
                    <span className={`collection-icon ${item.tint}`}><Icon name={item.icon} size={22} /></span>
                    <span className="collection-copy">
                      <strong>{item.label}</strong>
                      <span>{item.note}</span>
                    </span>
                    <span className="collection-count">{item.count}</span>
                    <Icon name="chevron" size={15} />
                  </Link>
                ))}
              </div>
            </section>

            <aside className="updates-panel" id="updates" aria-labelledby="updates-title">
              <div className="section-title-row">
                <div>
                  <span className="section-kicker">Recently changed</span>
                  <h2 id="updates-title">Archive Updates</h2>
                </div>
                <Link href="#updates">All updates</Link>
              </div>
              <div className="update-list">
                <Link href="#characters" className="update-item">
                  <span className="update-date"><strong>25</strong>JUL</span>
                  <span><strong>Character guides</strong><small>Six build pages revised</small></span>
                </Link>
                <Link href="#collections" className="update-item">
                  <span className="update-date"><strong>23</strong>JUL</span>
                  <span><strong>New artifact set</strong><small>Bonuses and rankings added</small></span>
                </Link>
                <Link href="#rotation" className="update-item">
                  <span className="update-date"><strong>21</strong>JUL</span>
                  <span><strong>Domain schedules</strong><small>Rotation data verified</small></span>
                </Link>
              </div>
              <div className="quick-reference">
                <span className="qr-decoration" />
                <Icon name="sparkles" size={20} />
                <div><strong>Quick Reference</strong><p>Check ascension costs and material totals.</p></div>
                <Link href="#characters">Open <Icon name="chevron" size={14} /></Link>
              </div>
            </aside>
          </div>

          <section className="characters-section" id="characters" aria-labelledby="characters-title">
            <div className="section-title-row">
              <div>
                <span className="section-kicker">Frequently viewed</span>
                <h2 id="characters-title">Popular Characters</h2>
              </div>
              <Link href="#characters">View all characters <Icon name="chevron" size={14} /></Link>
            </div>
            <div className="character-grid">
              {characters.map((character) => (
                <Link className="character-card" href="#characters" key={character.name}>
                  <div className={`character-portrait ${character.color}`}>
                    <span className="portrait-glyph">✦</span>
                    <span className="portrait-letter">{character.letter}</span>
                    <span className="rarity">★★★★★</span>
                  </div>
                  <div className="character-info">
                    <div><strong>{character.name}</strong><span>{character.status}</span></div>
                    <p>{character.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="mobile-bottom-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 4).map((item, index) => (
          <Link className={index === 0 ? "active" : ""} href={item.href} key={item.label}>
            <Icon name={item.icon} size={19} /><span>{item.label}</span>
          </Link>
        ))}
      </footer>
    </div>
  );
}
