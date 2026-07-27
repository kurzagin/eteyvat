"use client";

import { FormEvent, useEffect, useState } from "react";

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

      <div className="entity-grid mt-6">
        {result?.items.map((entity) => {
          let rarityColor = "var(--border)";
          if (entity.rarity === 5) rarityColor = "#d4af37";
          if (entity.rarity === 4) rarityColor = "#9b59b6";
          if (entity.rarity === 3) rarityColor = "#3498db";
          
          return (
            <article 
              className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded overflow-hidden flex flex-col relative aspect-[3/4] group shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl" 
              key={`${entity.kind}:${entity.id}`}
              style={{ borderBottom: `4px solid ${rarityColor}` }}
            >
              <div className="absolute inset-0 z-0 bg-[var(--surface)]">
                <EntityImage entity={entity} />
              </div>
              
              {entity.element && (
                <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm" title={entity.element}>
                  <span className="text-[10px] font-bold text-white uppercase">{entity.element.substring(0,2)}</span>
                </div>
              )}
              
              <div className="relative z-10 mt-auto bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-3 px-3">
                <h2 className="text-white font-bold text-center text-sm truncate drop-shadow-md">{entity.name}</h2>
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
