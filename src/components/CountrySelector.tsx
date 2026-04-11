"use client";

import type { CountryMeta } from "@/types";

interface Props {
  countries: CountryMeta[];
  selected: string;
  onChange: (country: string) => void;
}

export default function CountrySelector({ countries, selected, onChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <label
        htmlFor="country-select"
        className="text-xs font-medium tracking-widest uppercase text-ef-dim"
      >
        Country
      </label>
      <select
        id="country-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="bg-ef-bg1 border border-ef-bg3 text-ef-fg rounded-md px-3 py-2 text-sm
                   focus:outline-none focus:ring-1 focus:ring-ef-green focus:border-ef-green
                   min-w-60 cursor-pointer transition-colors hover:border-ef-bg4"
      >
        <option value="">— choose a country —</option>
        {countries.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name} ({c.tournaments.join(", ")})
          </option>
        ))}
      </select>
    </div>
  );
}
