# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # regenerates JSON data, then starts Next.js dev server
npm run build        # regenerates JSON data (prebuild), then builds static export
npm run generate-data  # regenerate src/data/worldcup-data.json from Excel files only
```

There are no tests and no linter configured.

## Architecture

### Data pipeline

Raw data lives in `data/excel/` as `.xlsx` files (one per World Cup year: 1994–2022).

`scripts/process-data.ts` reads every Excel file at build time using **SheetJS** (`xlsx`), skips row 0 (title row), uses row 1 as headers, and writes a single typed JSON file to `src/data/worldcup-data.json`. This script runs automatically before every `dev` and `build`. If you add a new tournament, register it in the `FILES` array at the top of that script.

The JSON shape matches the types in `src/types/index.ts` (`WorldCupData → Tournament[] + CountryMeta[]`).

### Data access

`src/lib/data.ts` is the only place that imports the JSON. It exports:
- Typed accessor functions (`getCountryRosters`, `getContinentDistribution`, `getLeagueDistribution`, `getPlayerOverlap`)
- The `CONTINENT_MAP` — if a new `clubCountry` value appears in the Excel data it will fall through to `"Unknown"`. Verify with a quick `node -e` script and add the entry to the map.

### Frontend

Single-page app (`src/app/page.tsx`). All state is `useState` with URL sync via `?country=` search param. The page is a client component wrapped in `<Suspense>` (required for `useSearchParams` with static export).

Charts use **Recharts**. `ContinentChart` and `LeagueChart` are stacked bar charts; both accept pre-computed row arrays from the data accessors and render entirely client-side.

`CountrySelector` is a custom combobox (not a native `<select>`) with keyboard navigation and live filtering — no external dependency.

### Styling

**Tailwind v4** with CSS-first configuration. Custom Everforest Dark Hard color tokens are defined in `src/app/globals.css` under `@theme` and are available as `bg-ef-*` / `text-ef-*` / `border-ef-*` utilities throughout. Body font is **Outfit** (variable, loaded via `next/font/google`); monospace is Geist Mono.

Year accent colors: 1994 = `ef-blue`, 1998 = `ef-green`, 2002 = `ef-yellow` — follow this pattern if adding more years.

### Deployment

`next.config.ts` sets `output: "export"` for a fully static build. Vercel auto-runs `prebuild` (data generation) before the Next.js build step. No server-side code.
