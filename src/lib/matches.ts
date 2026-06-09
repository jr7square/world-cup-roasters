import type { WCMatch, FormResult } from "@/types";
import matchesJson from "@/data/matches-2026.json";
import wcData from "@/data/worldcup-data.json";

const { groupSchedule, knockoutMatches, teamForm } =
  matchesJson as unknown as {
    groupSchedule: Record<string, { date: string; time: string; venue: string; city: string }>;
    knockoutMatches: WCMatch[];
    teamForm: Record<string, FormResult[]>;
  };

// FIFA 4-team group pairing pattern
// MD1: t0 vs t1, t2 vs t3
// MD2: t0 vs t2, t1 vs t3
// MD3: t0 vs t3, t1 vs t2
const MATCHDAY_PAIRINGS: [number, number][][] = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

function buildGroupMap(): Record<string, string[]> {
  const tournament = wcData.tournaments.find((t) => t.year === 2026);
  if (!tournament) return {};

  const groupMap: Record<string, string[]> = {};
  for (const [country, roster] of Object.entries(tournament.teams)) {
    const g = (roster as { group: string }).group;
    if (!groupMap[g]) groupMap[g] = [];
    groupMap[g].push(country);
  }
  return groupMap;
}

export function getGroupMatches(): WCMatch[] {
  const groupMap = buildGroupMap();
  const matches: WCMatch[] = [];

  for (const [groupLetter, teams] of Object.entries(groupMap)) {
    for (let md = 0; md < 3; md++) {
      const pairings = MATCHDAY_PAIRINGS[md];
      for (let p = 0; p < 2; p++) {
        const [ia, ib] = pairings[p];
        const id = `GS-${groupLetter}-MD${md + 1}-${p + 1}`;
        const sched = groupSchedule[id];
        matches.push({
          id,
          stage: "group",
          group: groupLetter,
          matchday: md + 1,
          date: sched?.date ?? "",
          time: sched?.time ?? "",
          venue: sched?.venue ?? "",
          city: sched?.city ?? "",
          teamA: teams[ia] ?? null,
          teamB: teams[ib] ?? null,
          scoreA: null,
          scoreB: null,
          status: "upcoming",
        });
      }
    }
  }

  return matches.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

export function getKnockoutMatches(): WCMatch[] {
  return knockoutMatches;
}

export function getAllMatches(): WCMatch[] {
  return [...getGroupMatches(), ...getKnockoutMatches()];
}

export function getMatchById(id: string): WCMatch | undefined {
  return getAllMatches().find((m) => m.id === id);
}

export function getTeamForm(team: string): FormResult[] {
  return teamForm[team] ?? [];
}

export function getAllMatchIds(): string[] {
  return getAllMatches().map((m) => m.id);
}

export function getGroupMap(): Record<string, string[]> {
  return buildGroupMap();
}

export const STAGE_LABELS: Record<string, string> = {
  group: "Group Stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-finals",
  sf: "Semi-finals",
  third: "Third Place",
  final: "Final",
};

export const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;
