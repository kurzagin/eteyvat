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
};

type EntityResponse = {
  items: EntityPreview[];
  preview: boolean;
  total: number;
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

  function searchParams(search: string) {
    const params = new URLSearchParams({ limit: compact ? "12" : "30" });
    if (kind) params.set("kind", kind);
    if (search) params.set("q", search);
    return params;
  }

  async function load(search: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/entities?${searchParams(search)}`);
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
    const params = new URLSearchParams({ limit: compact ? "12" : "30" });
    if (kind) params.set("kind", kind);

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
  }, [compact, kind]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query);
    void load(query.trim());
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

      <div className="entity-grid">
        {result?.items.map((entity) => (
          <article className="entity-card" key={`${entity.kind}:${entity.id}`}>
            <div className="entity-card-mark" aria-hidden="true">
              {entity.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span>{kindLabels[entity.kind] ?? entity.kind}</span>
              <h2>{entity.name}</h2>
              <p>{entity.description ?? "Structured record ready for graph retrieval."}</p>
            </div>
            <footer>
              <code>{entity.kind}:{entity.slug}</code>
              {entity.gameVersion ? <small>Added {entity.gameVersion}</small> : null}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
