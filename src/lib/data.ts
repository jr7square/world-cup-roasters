import rawData from "@/data/worldcup-data.json";
import type { WorldCupData, TeamRoster, Player } from "@/types";

export type Continent =
  | "Europe"
  | "South America"
  | "North America"
  | "Africa"
  | "Asia"
  | "Oceania"
  | "Unknown";

const CONTINENT_MAP: Record<string, Continent> = {
  // Europe
  Austria: "Europe", Belgium: "Europe", Bulgaria: "Europe", Croatia: "Europe",
  "Czech Republic": "Europe", Denmark: "Europe", England: "Europe",
  France: "Europe", Germany: "Europe", Greece: "Europe", Hungary: "Europe",
  Italy: "Europe", Netherlands: "Europe", Norway: "Europe", Poland: "Europe",
  Portugal: "Europe", Romania: "Europe", Russia: "Europe", Scotland: "Europe",
  Slovenia: "Europe", Spain: "Europe", Sweden: "Europe", Switzerland: "Europe",
  Turkey: "Europe", Ukraine: "Europe", Yugoslavia: "Europe",
  // South America
  Argentina: "South America", Bolivia: "South America", Brazil: "South America",
  Chile: "South America", Colombia: "South America", Ecuador: "South America",
  Paraguay: "South America", Uruguay: "South America",
  // North/Central America & Caribbean
  "Costa Rica": "North America", Jamaica: "North America",
  Mexico: "North America", USA: "North America",
  // Africa
  Cameroon: "Africa", "Côte d'Ivoire": "Africa", Egypt: "Africa",
  Morocco: "Africa", Nigeria: "Africa", Senegal: "Africa",
  "South Africa": "Africa", Tunisia: "Africa",
  // Asia
  China: "Asia", Iran: "Asia", Israel: "Asia", Japan: "Asia",
  Qatar: "Asia", "Saudi Arabia": "Asia", "South Korea": "Asia",
};

export function getContinent(clubCountry: string): Continent {
  return CONTINENT_MAP[clubCountry] ?? "Unknown";
}

export const data = rawData as unknown as WorldCupData;

export function getCountry(name: string) {
  return data.countries.find((c) => c.name === name) ?? null;
}

export function getCountryRosters(country: string): Record<number, TeamRoster> {
  const result: Record<number, TeamRoster> = {};
  for (const t of data.tournaments) {
    if (t.teams[country]) {
      result[t.year] = t.teams[country];
    }
  }
  return result;
}

export const CONTINENT_ORDER: Continent[] = [
  "Europe", "South America", "North America", "Africa", "Asia", "Oceania", "Unknown",
];

export function getContinentDistribution(
  country: string
): Record<string, number | string>[] {
  return data.tournaments
    .filter((t) => t.teams[country])
    .map((t) => {
      const players = t.teams[country].players;
      const row: Record<string, number | string> = { year: String(t.year) };
      for (const c of CONTINENT_ORDER) row[c] = 0;
      for (const p of players) {
        const c = getContinent(p.clubCountry);
        (row[c] as number)++;
      }
      return row;
    });
}

// Returns top N leagues by total player-count across all years, plus "Other"
export function getLeagueDistribution(
  country: string,
  topN = 7
): { data: Record<string, number | string>[]; leagues: string[] } {
  const tournaments = data.tournaments.filter((t) => t.teams[country]);

  // Count totals across all years to pick top leagues
  const totals: Record<string, number> = {};
  for (const t of tournaments) {
    for (const p of t.teams[country].players) {
      const league = p.league || "Unknown";
      totals[league] = (totals[league] ?? 0) + 1;
    }
  }

  const topLeagues = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);

  const rows = tournaments.map((t) => {
    const row: Record<string, number | string> = { year: String(t.year) };
    for (const l of topLeagues) row[l] = 0;
    row["Other"] = 0;
    for (const p of t.teams[country].players) {
      const league = p.league || "Unknown";
      if (topLeagues.includes(league)) {
        (row[league] as number)++;
      } else {
        (row["Other"] as number)++;
      }
    }
    return row;
  });

  return { data: rows, leagues: [...topLeagues, "Other"] };
}

export function getPlayerOverlap(
  country: string
): { name: string; years: number[] }[] {
  const nameToYears: Record<string, number[]> = {};
  for (const t of data.tournaments) {
    const roster = t.teams[country];
    if (!roster) continue;
    for (const p of roster.players) {
      if (!nameToYears[p.name]) nameToYears[p.name] = [];
      nameToYears[p.name].push(t.year);
    }
  }
  return Object.entries(nameToYears)
    .filter(([, years]) => years.length >= 2)
    .map(([name, years]) => ({ name, years: years.sort() }))
    .sort((a, b) => b.years.length - a.years.length || a.name.localeCompare(b.name));
}
