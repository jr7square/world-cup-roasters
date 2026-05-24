import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import type { Player, TeamRoster, Tournament, CountryMeta, WorldCupData } from "../src/types/index";

const FILES: { year: number; file: string }[] = [
  { year: 1994, file: "data/excel/1994_WorldCup_Rosters.xlsx" },
  { year: 1998, file: "data/excel/1998_WorldCup_Rosters.xlsx" },
  { year: 2002, file: "data/excel/2002_WorldCup_Rosters.xlsx" },
  { year: 2006, file: "data/excel/2006_WorldCup_Rosters.xlsx" },
  { year: 2010, file: "data/excel/2010_WorldCup_Rosters.xlsx" },
  { year: 2014, file: "data/excel/2014_WorldCup_Rosters.xlsx" },
  { year: 2018, file: "data/excel/2018_WorldCup_Rosters.xlsx" },
  { year: 2022, file: "data/excel/2022_WorldCup_Rosters.xlsx" },
  { year: 2026, file: "data/excel/2026_WorldCup_Rosters.xlsx" },
];

function parsePlayer(row: Record<string, unknown>): Player | null {
  const teamName = String(row["National Team"] ?? "").trim();
  // Skip repeated header rows
  if (teamName === "National Team" || teamName === "") return null;

  const rawName = String(row["Player"] ?? "").trim();
  const isCaptain = rawName.includes("(c)");
  const name = rawName.replace(/\s*\(c\)\s*/g, "").trim();
  if (!name) return null;

  const rawPos = String(row["Pos."] ?? row["Pos"] ?? "").trim();
  const rawNo = row["No."] ?? row["No"];
  const number = rawNo !== undefined && rawNo !== "" ? Number(rawNo) : null;

  const tier = String(row["Tier"] ?? row["League Tier"] ?? "N/A").trim();

  return {
    number: isNaN(number as number) ? null : number,
    position: rawPos,
    name,
    isCaptain,
    club: String(row["Club"] ?? "").trim(),
    clubCountry: String(row["Club Country"] ?? "").trim(),
    league: String(row["League / Competition"] ?? row["League/Competition"] ?? row["League"] ?? "").trim(),
    tier,
  };
}

function processFile(year: number, filePath: string): Tournament {
  const wb = XLSX.readFile(filePath);

  // Prefer "All Players" sheet, fall back to first sheet
  const sheetName = wb.SheetNames.includes("All Players")
    ? "All Players"
    : wb.SheetNames[0];

  const ws = wb.Sheets[sheetName];
  // Row 0 is a title row; row 1 has the actual column headers
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
    range: 1,
  });

  const teams: Record<string, TeamRoster> = {};

  for (const row of rows) {
    const teamName = String(row["National Team"] ?? "").trim();
    if (!teamName || teamName === "National Team") continue;

    const player = parsePlayer(row);
    if (!player) continue;

    if (!teams[teamName]) {
      teams[teamName] = {
        group: String(row["Group"] ?? "").trim(),
        players: [],
      };
    }
    teams[teamName].players.push(player);
  }

  const teamNames = Object.keys(teams);
  const avgSquadSize =
    teamNames.length > 0
      ? Math.round(
          teamNames.reduce((sum, t) => sum + teams[t].players.length, 0) /
            teamNames.length
        )
      : 0;

  return {
    year,
    teamCount: teamNames.length,
    squadSize: avgSquadSize,
    teams,
  };
}

function buildCountries(tournaments: Tournament[]): CountryMeta[] {
  const map: Record<string, Set<number>> = {};
  for (const t of tournaments) {
    for (const teamName of Object.keys(t.teams)) {
      if (!map[teamName]) map[teamName] = new Set();
      map[teamName].add(t.year);
    }
  }
  return Object.entries(map)
    .map(([name, yearsSet]) => ({
      name,
      tournaments: Array.from(yearsSet).sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const tournaments: Tournament[] = FILES.map(({ year, file }) => {
  console.log(`Processing ${year}...`);
  return processFile(year, path.join(process.cwd(), file));
});

const countries = buildCountries(tournaments);
const data: WorldCupData = { tournaments, countries };

const outPath = path.join(process.cwd(), "src/data/worldcup-data.json");
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log(`\nWrote ${outPath}`);
console.log(`  Tournaments: ${tournaments.map((t) => `${t.year} (${t.teamCount} teams)`).join(", ")}`);
console.log(`  Countries: ${countries.length} unique`);
console.log(
  `  In all 3: ${countries.filter((c) => c.tournaments.length === 3).map((c) => c.name).join(", ")}`
);
