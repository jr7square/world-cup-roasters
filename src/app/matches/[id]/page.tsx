import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import FormBadge from "@/components/FormBadge";
import { getMatchById, getAllMatchIds, getTeamForm, STAGE_LABELS } from "@/lib/matches";
import type { FormResult } from "@/types";

export function generateStaticParams() {
  return getAllMatchIds().map((id) => ({ id }));
}

function formatDate(dateStr: string, time: string): string {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr + "T12:00:00");
  const date = d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `${date} · ${time} local`;
}

function ResultRow({ r }: { r: FormResult }) {
  const scoreColor =
    r.result === "W" ? "text-ef-green" : r.result === "L" ? "text-ef-red" : "text-ef-yellow";
  const bg =
    r.result === "W" ? "bg-ef-green/10" : r.result === "L" ? "bg-ef-red/10" : "bg-ef-yellow/10";

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md ${bg}`}>
      <span
        className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-bold shrink-0 ${
          r.result === "W"
            ? "bg-ef-green text-ef-bg"
            : r.result === "L"
            ? "bg-ef-red text-ef-bg"
            : "bg-ef-yellow text-ef-bg"
        }`}
      >
        {r.result}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-ef-fg">
          {r.home ? "vs" : "@"}{" "}
          <span className="font-medium">{r.opponent}</span>
        </div>
        <div className="text-xs text-ef-dim">{r.competition}</div>
      </div>
      <div className={`text-sm font-mono font-semibold ${scoreColor} shrink-0`}>
        {r.goalsFor}–{r.goalsAgainst}
      </div>
    </div>
  );
}

interface TeamFormPanelProps {
  team: string | null;
  align: "left" | "right";
}

function TeamFormPanel({ team, align }: TeamFormPanelProps) {
  const form = team ? getTeamForm(team) : [];
  const wins = form.filter((r) => r.result === "W").length;
  const draws = form.filter((r) => r.result === "D").length;
  const losses = form.filter((r) => r.result === "L").length;
  const gf = form.reduce((s, r) => s + r.goalsFor, 0);
  const ga = form.reduce((s, r) => s + r.goalsAgainst, 0);

  return (
    <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start"}`}>
      <div className="text-2xl font-bold text-ef-fg mb-1">{team ?? "TBD"}</div>
      {team && (
        <>
          <div className="text-xs text-ef-dim mb-3">
            Last 5: {wins}W {draws}D {losses}L · {gf} GF {ga} GA
          </div>
          <FormBadge form={form} />
        </>
      )}
    </div>
  );
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = getMatchById(id);
  if (!match) notFound();

  const formA = match.teamA ? getTeamForm(match.teamA) : [];
  const formB = match.teamB ? getTeamForm(match.teamB) : [];
  const stageLabel = STAGE_LABELS[match.stage] ?? match.stage;

  return (
    <div className="min-h-screen bg-ef-bg text-ef-fg">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ef-dim mb-6">
          <Link href="/matches" className="hover:text-ef-fg transition-colors">
            Matches
          </Link>
          <span>›</span>
          <span className="text-ef-fg">{stageLabel}{match.group ? ` · Group ${match.group}` : ""}</span>
        </div>

        {/* Match header */}
        <div className="rounded-md border border-ef-bg2 bg-ef-bg1 p-6 mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-ef-dim mb-4">
            {stageLabel}{match.group ? ` · Group ${match.group}` : ""}{match.matchday ? ` · Matchday ${match.matchday}` : ""}
          </div>

          {/* Teams + score */}
          <div className="grid grid-cols-3 items-center gap-4 mb-5">
            <TeamFormPanel team={match.teamA} align="left" />
            <div className="text-center">
              {match.scoreA !== null && match.scoreB !== null ? (
                <div className="text-4xl font-bold font-mono text-ef-fg">
                  {match.scoreA} <span className="text-ef-dim">–</span> {match.scoreB}
                </div>
              ) : (
                <div className="text-3xl font-bold text-ef-dim">vs</div>
              )}
            </div>
            <TeamFormPanel team={match.teamB} align="right" />
          </div>

          {/* Venue / date */}
          <div className="text-xs text-ef-dim text-center border-t border-ef-bg2 pt-4">
            {formatDate(match.date, match.time)}<br />
            {match.venue} · {match.city}
          </div>
        </div>

        {/* Form comparison */}
        {(match.teamA || match.teamB) && (
          <section className="space-y-6">
            <h3 className="text-sm font-medium tracking-widest uppercase text-ef-dim">
              Recent Form (Last 5)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team A form */}
              {match.teamA && (
                <div>
                  <div className="text-sm font-semibold text-ef-fg mb-3">{match.teamA}</div>
                  <div className="space-y-1.5">
                    {formA.length > 0 ? (
                      formA.map((r, i) => <ResultRow key={i} r={r} />)
                    ) : (
                      <p className="text-ef-dim text-sm">No recent form data available.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Team B form */}
              {match.teamB && (
                <div>
                  <div className="text-sm font-semibold text-ef-fg mb-3">{match.teamB}</div>
                  <div className="space-y-1.5">
                    {formB.length > 0 ? (
                      formB.map((r, i) => <ResultRow key={i} r={r} />)
                    ) : (
                      <p className="text-ef-dim text-sm">No recent form data available.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
