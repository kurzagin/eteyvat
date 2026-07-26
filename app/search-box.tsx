"use client";

import { useEffect, useRef, useState } from "react";

const searchableItems = [
  { name: "Alhaitham", type: "Character", href: "#characters" },
  { name: "Nahida", type: "Character", href: "#characters" },
  { name: "Furina", type: "Character", href: "#characters" },
  { name: "Neuvillette", type: "Character", href: "#characters" },
  { name: "Light of Foliar Incision", type: "Weapon", href: "#collections" },
  { name: "Golden Troupe", type: "Artifact Set", href: "#collections" },
  { name: "Cecilia Garden", type: "Domain", href: "#rotation" },
  { name: "Weapon ascension materials", type: "Material", href: "#rotation" },
];

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = query.trim()
    ? searchableItems
        .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        inputRef.current?.blur();
        setFocused(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className={`search-control ${focused ? "is-focused" : ""}`}>
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </svg>
      <input
        aria-label="Search the E-Teyvat knowledge base"
        autoComplete="off"
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Search characters, weapons, artifacts, quests..."
        ref={inputRef}
        type="search"
        value={query}
      />
      <kbd>⌘ K</kbd>
      {focused && query && (
        <div className="search-results">
          <div className="search-results-label">Search results</div>
          {results.length ? (
            results.map((item) => (
              <a href={item.href} key={item.name} onClick={() => setQuery(item.name)}>
                <span>{item.name}</span><small>{item.type}</small>
              </a>
            ))
          ) : (
            <p>No matching entries. Try a character or item name.</p>
          )}
        </div>
      )}
    </div>
  );
}
