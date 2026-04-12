"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { CountryMeta } from "@/types";

interface Props {
  countries: CountryMeta[];
  selected: string;
  onChange: (country: string) => void;
}

export default function CountrySelector({ countries, selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query.trim()
    ? countries.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : countries;

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Reset highlight when filter changes
  useEffect(() => { setHighlighted(0); }, [query]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[highlighted] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  const select = useCallback((name: string) => {
    onChange(name);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }, [onChange]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) select(filtered[highlighted].name);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  const displayValue = open ? query : (selected || "");

  return (
    <div ref={containerRef} className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <label
        htmlFor="country-input"
        className="text-xs font-medium tracking-widest uppercase text-ef-dim shrink-0"
      >
        Country
      </label>

      <div className="relative min-w-72">
        <input
          ref={inputRef}
          id="country-input"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={selected || "Search or choose a country…"}
          value={displayValue}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full bg-ef-bg1 border border-ef-bg3 text-ef-fg rounded-md px-3 py-2 text-sm
                     placeholder:text-ef-dim focus:outline-none focus:ring-1
                     focus:ring-ef-green focus:border-ef-green transition-colors
                     hover:border-ef-bg4 cursor-text pr-8"
        />
        {/* Chevron */}
        <span
          className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ef-dim transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {/* Dropdown */}
        {open && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto
                       bg-ef-bg1 border border-ef-bg3 rounded-md shadow-xl
                       py-1 text-sm"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-ef-dim">No matches</li>
            ) : (
              filtered.map((c, i) => (
                <li
                  key={c.name}
                  role="option"
                  aria-selected={c.name === selected}
                  onPointerDown={(e) => { e.preventDefault(); select(c.name); }}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between gap-4 transition-colors
                    ${i === highlighted ? "bg-ef-bg2 text-ef-fg" : "text-ef-fg hover:bg-ef-bg2/60"}
                    ${c.name === selected ? "text-ef-green" : ""}`}
                >
                  <span>{c.name}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Clear button */}
      {selected && !open && (
        <button
          onClick={() => { onChange(""); setQuery(""); }}
          className="text-xs text-ef-dim hover:text-ef-fg transition-colors"
        >
          clear
        </button>
      )}
    </div>
  );
}
