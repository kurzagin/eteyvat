import Link from "next/link";

const sections = [
  { label: "Home", href: "/" },
  { label: "Characters", href: "/database/characters/" },
  { label: "Weapons", href: "/database/weapons/" },
  { label: "Materials", href: "/database/materials/" },
  { label: "Domains", href: "/database/domains/" },
  { label: "Knowledge", href: "/knowledge/" },
];

export function DatabaseShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="database-page">
      <header className="database-topbar">
        <Link href="/" className="database-wordmark">
          <span className="mini-brand" aria-hidden="true" />
          <span>
            <strong>E-Teyvat</strong>
            <small>Knowledge graph</small>
          </span>
        </Link>
        <nav aria-label="Knowledge base">
          {sections.map((section) => (
            <Link href={section.href} key={section.href}>
              {section.label}
            </Link>
          ))}
        </nav>
        <Link href="/explore/" className="database-search-link">
          Search all data
        </Link>
      </header>
      <main className="database-page-main">
        <section className="database-page-heading">
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        {children}
      </main>
    </div>
  );
}

