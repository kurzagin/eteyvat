import Image from "next/image";
import Link from "next/link";

type IconName =
  | "home"
  | "users"
  | "sword"
  | "artifact"
  | "enemy"
  | "quest"
  | "map"
  | "calendar"
  | "chevron"
  | "clock";

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 10.8 9-7 9 7" /><path d="M5 9.5V21h14V9.5M9 21v-7h6v7" /></>,
    users: <><circle cx="9" cy="7" r="3.5" /><path d="M3 20c.4-4.3 2.4-6.5 6-6.5s5.6 2.2 6 6.5M16 4.8a3.4 3.4 0 0 1 0 6.5M17 14c2.5.6 3.8 2.5 4 5.3" /></>,
    sword: <><path d="m14.5 4.5 5-1-1 5L8 19l-3 1 1-3Z" /><path d="m11 12 3 3M5 14l5 5" /></>,
    artifact: <><path d="m12 3 6 4v10l-6 4-6-4V7Z" /><path d="m12 7 3.5 2v6L12 17l-3.5-2V9Z" /></>,
    enemy: <><path d="m6 8-3-4 5 2 4-3 4 3 5-2-3 4 1 4c0 5-3 9-7 9s-7-4-7-9Z" /><path d="m9 12 2 1M15 12l-2 1M10 17h4" /></>,
    quest: <><path d="M5 3h14v18H5z" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 18h2" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };

  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      {paths[name]}
    </svg>
  );
}

const navigation: { label: string; icon: IconName; href: string }[] = [
  { label: "Home", icon: "home", href: "#home" },
  { label: "Characters", icon: "users", href: "#characters" },
  { label: "Weapons", icon: "sword", href: "#banners" },
  { label: "Artifacts", icon: "artifact", href: "#rotation" },
  { label: "Enemies", icon: "enemy", href: "#rotation" },
  { label: "Quests", icon: "quest", href: "#home" },
  { label: "Regions", icon: "map", href: "#home" },
];

const rotations = [
  { type: "Weapon materials", title: "All series available", note: "Sunday selection", icon: "sword" as IconName, color: "gold", drops: ["D", "A", "B"] },
  { type: "Talent books", title: "All teachings available", note: "Sunday selection", icon: "users" as IconName, color: "cyan", drops: ["F", "I", "O"] },
  { type: "Weekly bosses", title: "3 discounted claims", note: "Resets Monday", icon: "enemy" as IconName, color: "violet", drops: ["W", "30", "3×"] },
];

const characterPreview = [
  { name: "Nahida", element: "Dendro", role: "Support", image: "/characters/nahida.png" },
  { name: "Furina", element: "Hydro", role: "Support", image: "/characters/furina.png" },
  { name: "Arlecchino", element: "Pyro", role: "DPS", image: "/characters/arlecchino.png" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>;
}

export default function Home() {
  return (
    <div className="site-shell" id="home">
      <header className="topbar">
        <Link className="topbar-logo" href="#home" aria-label="E-Teyvat home"><BrandMark /></Link>
        <Link className="topbar-brand" href="#home">
          <strong>E-Teyvat</strong>
          <span>Genshin Database</span>
        </Link>
        <div className="topbar-status">
          <span className="data-live"><i />Data updated</span>
          <span className="version-badge">v5.8 · Phase II</span>
        </div>
      </header>

      <aside className="sidebar">
        <nav aria-label="Database navigation">
          {navigation.map((item, index) => (
            <Link className={`rail-link ${index === 0 ? "active" : ""}`} href={item.href} key={item.label} aria-label={item.label}>
              <Icon name={item.icon} />
              <span className="rail-tooltip">{item.label}</span>
            </Link>
          ))}
        </nav>
        <span className="rail-status" title="Database online"><i /></span>
      </aside>

      <main className="main-content">
        <div className="content-wrap">
          <section className="page-heading">
            <div><h1>Home</h1><p>Daily game data at a glance.</p></div>
            <div className="server-time"><Icon name="clock" size={15} /><span>Server reset in</span><strong>07:42:18</strong></div>
          </section>

          <section className="rotation-section" id="rotation" aria-labelledby="rotation-title">
            <div className="section-header">
              <div><span className="section-icon"><Icon name="calendar" /></span><div><h2 id="rotation-title">Today&apos;s Rotation</h2><p>Sunday · All material domains are open</p></div></div>
              <Link href="#rotation">All domains <Icon name="chevron" size={14} /></Link>
            </div>
            <div className="rotation-grid">
              {rotations.map((item) => (
                <Link className={`rotation-card ${item.color}`} href="#rotation" key={item.type}>
                  <span className="rotation-icon"><Icon name={item.icon} /></span>
                  <div><span>{item.type}</span><strong>{item.title}</strong><small>{item.note}</small></div>
                  <div className="drop-stack">{item.drops.map((drop) => <i key={drop}>{drop}</i>)}</div>
                  <Icon name="chevron" size={14} />
                </Link>
              ))}
            </div>
          </section>

          <section className="banner-grid" id="banners" aria-label="Current banners">
            <Link className="banner-image-card" href="#characters">
              <div className="banner-placeholder character-placeholder">
                <span className="placeholder-icon"><Icon name="users" size={24} /></span>
                <span className="placeholder-copy">
                  <strong>Character banner image</strong>
                  <small>Official artwork placeholder</small>
                </span>
              </div>
              <div className="banner-caption">
                <div><span>Character Event Wish</span><strong>Current character banner</strong></div>
                <Icon name="chevron" size={16} />
              </div>
            </Link>

            <Link className="banner-image-card" href="#banners">
              <div className="banner-placeholder weapon-placeholder">
                <span className="placeholder-icon"><Icon name="sword" size={24} /></span>
                <span className="placeholder-copy">
                  <strong>Weapon banner image</strong>
                  <small>Official artwork placeholder</small>
                </span>
              </div>
              <div className="banner-caption">
                <div><span>Weapon Event Wish</span><strong>Current weapon banner</strong></div>
                <Icon name="chevron" size={16} />
              </div>
            </Link>
          </section>

          <section className="character-database" id="characters" aria-labelledby="characters-title">
            <div className="database-copy">
              <span className="section-eyebrow">Character Database</span>
              <h2 id="characters-title">Find builds for every character</h2>
              <p>Talents, materials, weapons, artifacts, teams, and rotations in one place.</p>
              <div className="database-filters"><span>102 characters</span><span>7 elements</span><span>All regions</span></div>
              <Link className="primary-action" href="#characters">Browse characters <Icon name="chevron" size={15} /></Link>
            </div>
            <div className="database-portraits">
              {characterPreview.map((character, index) => (
                <div className={`database-character character-${index + 1}`} key={character.name}>
                  <Image src={character.image} alt={`${character.name} portrait`} fill sizes="(max-width: 640px) 42vw, 230px" />
                  <span><strong>{character.name}</strong><small>{character.element} · {character.role}</small></span>
                </div>
              ))}
            </div>
          </section>
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
