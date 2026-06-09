"use client";

import Link from "next/link";
import type { WCMatch } from "@/types";
import { getTeamForm } from "@/lib/matches";
import FormBadge from "./FormBadge";

interface Props {
  groupMatches: WCMatch[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface GroupCardProps {
  groupLetter: string;
  matches: WCMatch[];
}

function GroupCard({ groupLetter, matches }: GroupCardProps) {
  const teams = Array.from(
    new Set(matches.flatMap((m) => [m.teamA, m.teamB]).filter(Boolean) as string[])
  );

  const matchdays = [1, 2, 3].map((md) => matches.filter((m) => m.matchday === md));

  return (
    <div className="rounded-md border border-ef-bg2 overflow-hidden">
      <div className="px-4 py-2.5 bg-ef-bg1 border-b border-ef-bg2 flex items-center gap-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-ef-dim">Group</span>
        <span className="text-sm font-bold text-ef-fg">{groupLetter}</span>
      </div>

      {/* Teams list */}
      <div className="px-4 pt-3 pb-2 space-y-1.5">
        {teams.map((team) => (
          <div key={team} className="flex items-center justify-between gap-2">
            <span className="text-sm text-ef-fg truncate">{team}</span>
            <FormBadge form={getTeamForm(team)} />
          </div>
        ))}
      </div>

      {/* Matches */}
      <div className="border-t border-ef-bg2 divide-y divide-ef-bg2/60">
        {matchdays.map((mdMatches, mdIdx) =>
          mdMatches.map((m) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="flex items-center justify-between px-4 py-2 hover:bg-ef-bg1/60 transition-colors group"
            >
              <span className="text-xs text-ef-dim">MD{mdIdx + 1} · {formatDate(m.date)}</span>
              <span className="text-xs text-ef-fg font-medium text-right group-hover:text-ef-blue transition-colors">
                {m.teamA} <span className="text-ef-dim font-normal">vs</span> {m.teamB}
                <span className="ml-1 text-ef-dim text-[10px]">›</span>
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function GroupStageView({ groupMatches }: Props) {
  // Group matches by group letter
  const byGroup: Record<string, WCMatch[]> = {};
  for (const m of groupMatches) {
    if (!m.group) continue;
    if (!byGroup[m.group]) byGroup[m.group] = [];
    byGroup[m.group].push(m);
  }

  const groups = Object.keys(byGroup).sort();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groups.map((g) => (
        <GroupCard key={g} groupLetter={g} matches={byGroup[g]} />
      ))}
    </div>
  );
}
