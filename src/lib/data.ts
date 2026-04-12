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
  Austria: "Europe", Belgium: "Europe", Bosnia: "Europe", Bulgaria: "Europe",
  Croatia: "Europe", Cyprus: "Europe", "Czech Republic": "Europe",
  Denmark: "Europe", England: "Europe", Finland: "Europe", France: "Europe",
  Germany: "Europe", Greece: "Europe", Hungary: "Europe", Iceland: "Europe",
  Italy: "Europe", Netherlands: "Europe", Norway: "Europe", Poland: "Europe",
  Portugal: "Europe", Romania: "Europe", Russia: "Europe", Scotland: "Europe",
  Serbia: "Europe", Slovakia: "Europe", Slovenia: "Europe", Spain: "Europe",
  Sweden: "Europe", Switzerland: "Europe", Turkey: "Europe", Ukraine: "Europe",
  Yugoslavia: "Europe",
  // South America
  Argentina: "South America", Bolivia: "South America", Brazil: "South America",
  Chile: "South America", Colombia: "South America", Ecuador: "South America",
  Paraguay: "South America", Peru: "South America", Uruguay: "South America",
  // North/Central America & Caribbean
  Canada: "North America", "Costa Rica": "North America", Guatemala: "North America",
  Honduras: "North America", Jamaica: "North America", Mexico: "North America",
  Panama: "North America", "Trinidad & Tobago": "North America", USA: "North America",
  // Africa
  Algeria: "Africa", Angola: "Africa", Cameroon: "Africa", "Côte d'Ivoire": "Africa",
  Egypt: "Africa", Ghana: "Africa", Guinea: "Africa", "Ivory Coast": "Africa",
  Mali: "Africa", Morocco: "Africa", Nigeria: "Africa", Senegal: "Africa",
  "South Africa": "Africa", Togo: "Africa", Tunisia: "Africa",
  // Asia
  China: "Asia", Iran: "Asia", Israel: "Asia", Japan: "Asia", Kuwait: "Asia",
  "North Korea": "Asia", Qatar: "Asia", "Saudi Arabia": "Asia",
  "South Korea": "Asia", UAE: "Asia",
  // Oceania
  Australia: "Oceania", "New Zealand": "Oceania", "New Zealand/Australia": "Oceania",
};

export function getContinent(clubCountry: string): Continent {
  return CONTINENT_MAP[clubCountry] ?? "Unknown";
}

export const data = rawData as unknown as WorldCupData;

export function getCountry(name: string) {
  return data.countries.find((c) => c.name === name) ?? null;
}

export function getCountryRosters(country: string, years?: number[]): Record<number, TeamRoster> {
  const result: Record<number, TeamRoster> = {};
  for (const t of data.tournaments) {
    if (years && !years.includes(t.year)) continue;
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
  country: string,
  years?: number[]
): Record<string, number | string>[] {
  return data.tournaments
    .filter((t) => t.teams[country] && (!years || years.includes(t.year)))
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
  topN = 7,
  years?: number[]
): { data: Record<string, number | string>[]; leagues: string[]; leagueCountry: Record<string, string> } {
  const tournaments = data.tournaments.filter((t) => t.teams[country] && (!years || years.includes(t.year)));

  // Count totals and record the club country for each league
  const totals: Record<string, number> = {};
  const leagueCountry: Record<string, string> = {};
  for (const t of tournaments) {
    for (const p of t.teams[country].players) {
      const league = p.league || "Unknown";
      totals[league] = (totals[league] ?? 0) + 1;
      if (!leagueCountry[league] && p.clubCountry) {
        leagueCountry[league] = p.clubCountry;
      }
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

  return { data: rows, leagues: [...topLeagues, "Other"], leagueCountry };
}

export function getPlayerOverlap(
  country: string,
  years?: number[]
): { name: string; years: number[] }[] {
  const nameToYears: Record<string, number[]> = {};
  for (const t of data.tournaments) {
    if (years && !years.includes(t.year)) continue;
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
