"use client";

import { FormEvent, useEffect, useState } from "react";
import { Flame, Droplets, Wind, Zap, Snowflake, Leaf, Mountain, Star, HelpCircle } from "lucide-react";

type EntityPreview = {
  id: number;
  kind: string;
  slug: string;
  name: string;
  description: string | null;
  gameVersion: string | null;
  image: string | null;
  rarity: number | null;
  element: string | null;
};

type EntityResponse = {
  items: EntityPreview[];
  preview: boolean;
  total: number;
  page: number;
  limit: number;
};

const kindLabels: Record<string, string> = {
  characters: "Character",
  weapons: "Weapon",
  materials: "Material",
  domains: "Domain",
  artifacts: "Artifact",
  enemies: "Enemy",
  geographies: "Region",
};

function EntityImage({ entity }: { entity: EntityPreview }) {
  const [error, setError] = useState(false);
  
  if (!entity.image || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--surface-sunken)]">
        <span className="text-4xl font-bold text-[var(--accent)] opacity-20">{entity.name.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }
  
  return (
    <img 
      src={entity.image} 
      alt={entity.name} 
      onError={() => setError(true)}
      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
    />
  );
}

export function EntityExplorer({
  kind,
  compact = false,
}: {
  kind?: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [result, setResult] = useState<EntityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  function searchParams(search: string, pageNum: number = 1) {
    const params = new URLSearchParams({ 
      limit: compact ? "12" : "24",
      page: pageNum.toString()
    });
    if (kind) params.set("kind", kind);
    if (search) params.set("q", search);
    return params;
  }

  async function load(search: string, pageNum: number = 1) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/entities?${searchParams(search, pageNum)}`);
      if (!response.ok) throw new Error("The knowledge API is unavailable.");
      setResult((await response.json()) as EntityResponse);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ 
      limit: compact ? "12" : "24",
      page: page.toString() 
    });
    if (kind) params.set("kind", kind);
    if (submittedQuery) params.set("q", submittedQuery);

    setLoading(true);
    fetch(`/api/entities?${params}`)
      .then((response) => {
        if (!response.ok) throw new Error("The knowledge API is unavailable.");
        return response.json() as Promise<EntityResponse>;
      })
      .then((payload) => {
        if (active) setResult(payload);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Search failed.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [compact, kind, page, submittedQuery]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query);
    setPage(1); // Reset to page 1 on new search
  }

  return (
    <section className="entity-explorer" aria-busy={loading}>
      <form className="entity-search" onSubmit={submit}>
        <label>
          <span className="sr-only">
            Search {kind ? kindLabels[kind] ?? kind : "all entities"}
          </span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              kind ? `Search ${kind}…` : "Search characters, weapons, domains…"
            }
            type="search"
            value={query}
          />
        </label>
        <button type="submit">Search graph</button>
      </form>

      <div className="entity-result-meta">
        <span>
          {loading
            ? "Querying knowledge graph…"
            : `${result?.total ?? 0} ${kind ?? "entities"} shown`}
        </span>
        {result?.preview ? (
          <span className="preview-pill">Preview data · connect Neon for full results</span>
        ) : null}
      </div>

      {error ? <p className="data-error">{error}</p> : null}
      {!loading && !error && result?.items.length === 0 ? (
        <div className="empty-knowledge">
          <strong>No matching records</strong>
          <span>
            {submittedQuery
              ? `Nothing matched “${submittedQuery}”.`
              : "Run the first sync after connecting Neon."}
          </span>
        </div>
      ) : null}

      <div className="entity-grid mt-6 gap-6">
        {result?.items.map((entity) => {
          let rarityColor = "rgba(255, 255, 255, 0.1)"; // Default border
          let rarityGlow = "transparent";
          if (entity.rarity === 5) {
            rarityColor = "#d4af37";
            rarityGlow = "rgba(212, 175, 55, 0.4)";
          } else if (entity.rarity === 4) {
            rarityColor = "#a366ff";
            rarityGlow = "rgba(163, 102, 255, 0.4)";
          } else if (entity.rarity === 3) {
            rarityColor = "#4da6ff";
            rarityGlow = "rgba(77, 166, 255, 0.4)";
          }

          const getElementIcon = (element: string | null) => {
            if (!element) return null;
            const el = element.toLowerCase();
            const props = { size: 16, strokeWidth: 2.5, className: "text-white drop-shadow-md" };
            
            if (el.includes("pyro")) return <Flame {...props} color="#ff5a5a" />;
            if (el.includes("hydro")) return <Droplets {...props} color="#45b6ff" />;
            if (el.includes("anemo")) return <Wind {...props} color="#5ceda1" />;
            if (el.includes("electro")) return <Zap {...props} color="#c65df5" />;
            if (el.includes("cryo")) return <Snowflake {...props} color="#99ffff" />;
            if (el.includes("dendro")) return <Leaf {...props} color="#85cc33" />;
            if (el.includes("geo")) return <Mountain {...props} color="#ffb13b" />;
            return <HelpCircle {...props} />;
          };

          const ElementIcon = getElementIcon(entity.element);

          if (entity.kind !== "characters") {
            return (
              <article 
                className="group relative flex flex-col sm:flex-row rounded-xl overflow-hidden bg-[var(--surface-sunken)] border border-white/5 transition-all duration-300 hover:-translate-y-1 col-span-1 sm:col-span-2 lg:col-span-3 min-h-[120px]" 
                key={`${entity.kind}:${entity.id}`}
                style={{ 
                  boxShadow: `0 4px 15px -2px rgba(0,0,0,0.3), 0 0 10px ${rarityGlow}`,
                  borderLeft: `4px solid ${rarityColor}` 
                }}
              >
                <div className="absolute inset-0 z-0 bg-[var(--surface)] opacity-40">
                  {/* subtle background if needed */}
                </div>

                {/* Left side: Image (or Right side depending on preference) */}
                <div className="relative z-10 w-32 h-32 shrink-0 flex items-center justify-center bg-black/20 p-2 overflow-hidden rounded-l-xl">
                  <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110">
                    <EntityImage entity={entity} />
                  </div>
                </div>
                
                {/* Right side: Content */}
                <div className="relative z-10 flex-1 p-4 flex flex-col justify-center bg-gradient-to-r from-transparent to-black/40">
                  {entity.rarity && (
                    <div className="flex gap-0.5 mb-1 opacity-80">
                      {Array.from({ length: Math.min(entity.rarity, 5) }).map((_, i) => (
                        <Star key={i} size={10} fill="#ffc83d" color="#ffc83d" />
                      ))}
                    </div>
                  )}
                  <h2 className="text-white font-extrabold text-base sm:text-xl leading-tight drop-shadow-md tracking-wide max-w-full">
                    {entity.name}
                  </h2>
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mt-1">
                    {kindLabels[entity.kind] ?? entity.kind}
                  </span>
                </div>
              </article>
            );
          }

          return (
            <article 
              className="group relative flex flex-col rounded-xl overflow-hidden aspect-[3/4] bg-[var(--surface-sunken)] border border-white/5 transition-all duration-300 hover:-translate-y-2 col-span-1" 
              key={`${entity.kind}:${entity.id}`}
              style={{ 
                boxShadow: `0 4px 20px -2px rgba(0,0,0,0.5), 0 0 15px ${rarityGlow}`,
                borderBottom: `4px solid ${rarityColor}` 
              }}
            >
              <div className="absolute inset-0 z-0 bg-[var(--surface)] transition-transform duration-500 ease-out group-hover:scale-110">
                <EntityImage entity={entity} />
              </div>
              
              {/* Fade in shadow from bottom to top */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Element Badge */}
              {ElementIcon && (
                <div className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg group-hover:bg-black/60 transition-colors" title={entity.element!}>
                  {ElementIcon}
                </div>
              )}
              
              <div className="relative z-20 mt-auto p-4 flex flex-col justify-end h-full">
                <h2 className="text-white font-extrabold text-center text-base sm:text-lg leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                  {entity.name}
                </h2>
                <div className="w-8 h-0.5 bg-white/30 mx-auto mt-2 rounded-full group-hover:w-12 transition-all duration-300" style={{ backgroundColor: rarityColor }} />
              </div>
            </article>
          );
        })}
      </div>

      {result && result.total > result.limit && (
        <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-[var(--border)]">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-[var(--surface-raised)] border border-[var(--border)] rounded text-sm text-[var(--text-light)] disabled:opacity-50 hover:bg-[var(--surface-sunken)] transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--text-muted)]">
            Page {result.page} of {Math.ceil(result.total / result.limit)}
          </span>
          <button 
            disabled={page >= Math.ceil(result.total / result.limit)}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-[var(--surface-raised)] border border-[var(--border)] rounded text-sm text-[var(--text-light)] disabled:opacity-50 hover:bg-[var(--surface-sunken)] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
