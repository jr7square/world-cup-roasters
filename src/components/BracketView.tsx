"use client";

import Link from "next/link";
import type { WCMatch } from "@/types";

interface Props {
  knockoutMatches: WCMatch[];
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function TeamSlot({ name, score }: { name: string | null; score: number | null }) {
  return (
    <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 min-w-0">
      <span className={`text-xs truncate ${name ? "text-ef-fg" : "text-ef-dim italic"}`}>
        {name ?? "TBD"}
      </span>
      {score !== null && (
        <span className="text-xs font-mono font-semibold text-ef-yellow shrink-0">{score}</span>
      )}
    </div>
  );
}

interface MatchCardProps {
  match: WCMatch;
  compact?: boolean;
}

function MatchCard({ match, compact }: MatchCardProps) {
  const w = compact ? "w-36" : "w-44";
  return (
    <Link href={`/matches/${match.id}`} className={`${w} shrink-0 block`}>
      <div className="rounded border border-ef-bg2 bg-ef-bg1 hover:border-ef-blue transition-colors overflow-hidden">
        <TeamSlot name={match.teamA} score={match.scoreA} />
        <div className="border-t border-ef-bg2" />
        <TeamSlot name={match.teamB} score={match.scoreB} />
        <div className="border-t border-ef-bg2 px-2.5 py-1 bg-ef-bg">
          <span className="text-[10px] text-ef-dim">{formatShortDate(match.date)}</span>
        </div>
      </div>
    </Link>
  );
}

// Bracket arm for left half: right edge → merges upward or downward
// topHalf = true → arm goes from bottom of top slot to connect with bottom slot
function BracketArmLeft({ top }: { top: boolean }) {
  return (
    <div className="w-4 shrink-0 self-stretch flex flex-col">
      {top ? (
        <>
          <div className="flex-1" />
          <div className="h-1/2 border-r border-b border-ef-bg3" />
        </>
      ) : (
        <>
          <div className="h-1/2 border-r border-t border-ef-bg3" />
          <div className="flex-1" />
        </>
      )}
    </div>
  );
}

function BracketArmRight({ top }: { top: boolean }) {
  return (
    <div className="w-4 shrink-0 self-stretch flex flex-col">
      {top ? (
        <>
          <div className="flex-1" />
          <div className="h-1/2 border-l border-b border-ef-bg3" />
        </>
      ) : (
        <>
          <div className="h-1/2 border-l border-t border-ef-bg3" />
          <div className="flex-1" />
        </>
      )}
    </div>
  );
}

// A paired slot: two match cards connected by bracket arms (left half)
function BracketPairLeft({
  top,
  bottom,
  next,
}: {
  top: WCMatch;
  bottom: WCMatch;
  next?: WCMatch;
}) {
  return (
    <div className="flex items-stretch gap-0">
      {/* The two matches stacked */}
      <div className="flex flex-col gap-6">
        <MatchCard match={top} />
        <MatchCard match={bottom} />
      </div>
      {/* Right arms connecting to next round */}
      {next && (
        <div className="flex flex-col">
          <BracketArmLeft top={true} />
          <BracketArmLeft top={false} />
        </div>
      )}
    </div>
  );
}

function BracketPairRight({
  top,
  bottom,
  hasNext,
}: {
  top: WCMatch;
  bottom: WCMatch;
  hasNext?: boolean;
}) {
  return (
    <div className="flex items-stretch gap-0">
      {hasNext && (
        <div className="flex flex-col">
          <BracketArmRight top={true} />
          <BracketArmRight top={false} />
        </div>
      )}
      <div className="flex flex-col gap-6">
        <MatchCard match={top} />
        <MatchCard match={bottom} />
      </div>
    </div>
  );
}

// Connector line between rounds
function Connector() {
  return <div className="w-4 shrink-0 border-t border-ef-bg3 self-center" />;
}

// A single column of matches at a given round
function RoundColumn({
  matches,
  side,
  hasConnector,
}: {
  matches: WCMatch[];
  side: "left" | "right";
  hasConnector?: boolean;
}) {
  const pairs: [WCMatch, WCMatch][] = [];
  for (let i = 0; i < matches.length; i += 2) {
    if (matches[i + 1]) pairs.push([matches[i], matches[i + 1]]);
  }

  return (
    <div className="flex items-center gap-0">
      {side === "right" && hasConnector && (
        <div className="flex flex-col gap-6" style={{ marginTop: 0 }}>
          {pairs.map((_, i) => (
            <Connector key={i} />
          ))}
        </div>
      )}
      <div className="flex flex-col gap-10">
        {pairs.map(([top, bottom], i) =>
          side === "left" ? (
            <BracketPairLeft key={i} top={top} bottom={bottom} next={matches[0]} />
          ) : (
            <BracketPairRight key={i} top={top} bottom={bottom} hasNext={hasConnector} />
          )
        )}
        {/* Odd match (shouldn't happen in 16-team bracket but just in case) */}
        {matches.length % 2 !== 0 && <MatchCard match={matches[matches.length - 1]} />}
      </div>
      {side === "left" && hasConnector && (
        <div className="flex flex-col gap-6">
          {pairs.map((_, i) => (
            <Connector key={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BracketView({ knockoutMatches }: Props) {
  const byId = Object.fromEntries(knockoutMatches.map((m) => [m.id, m]));

  const r32Left = [1,2,3,4,5,6,7,8].map((n) => byId[`R32-${n}`]).filter(Boolean);
  const r32Right = [9,10,11,12,13,14,15,16].map((n) => byId[`R32-${n}`]).filter(Boolean);
  const r16Left = [1,2,3,4].map((n) => byId[`R16-${n}`]).filter(Boolean);
  const r16Right = [5,6,7,8].map((n) => byId[`R16-${n}`]).filter(Boolean);
  const qfLeft = [1,2].map((n) => byId[`QF-${n}`]).filter(Boolean);
  const qfRight = [3,4].map((n) => byId[`QF-${n}`]).filter(Boolean);
  const sf1 = byId["SF-1"];
  const sf2 = byId["SF-2"];
  const final = byId["FINAL"];
  const third = byId["THIRD"];

  return (
    <div className="overflow-x-auto pb-6">
      <div className="inline-flex items-start gap-0 min-w-max px-4 pt-6">

        {/* LEFT HALF: R32 → R16 → QF → SF */}
        <div className="flex items-center gap-0">
          {/* R32 Left */}
          <div className="flex flex-col gap-6 mr-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">R32</div>
            <RoundColumn matches={r32Left} side="left" hasConnector />
          </div>

          {/* R16 Left */}
          <div className="flex flex-col gap-6 mx-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">R16</div>
            <RoundColumn matches={r16Left} side="left" hasConnector />
          </div>

          {/* QF Left */}
          <div className="flex flex-col gap-6 mx-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">QF</div>
            <RoundColumn matches={qfLeft} side="left" hasConnector />
          </div>

          {/* SF1 */}
          <div className="flex flex-col gap-2 mx-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">SF</div>
            {sf1 && <MatchCard match={sf1} />}
          </div>
        </div>

        {/* CENTER: Final + Third */}
        <div className="flex flex-col items-center gap-4 mx-6 mt-8">
          <div className="text-[10px] font-medium tracking-widest uppercase text-ef-aqua mb-1 text-center">Final</div>
          {final && (
            <Link href={`/matches/${final.id}`} className="block">
              <div className="rounded border-2 border-ef-aqua bg-ef-bg1 hover:border-ef-blue transition-colors overflow-hidden w-48">
                <TeamSlot name={final.teamA} score={final.scoreA} />
                <div className="border-t border-ef-bg2" />
                <TeamSlot name={final.teamB} score={final.scoreB} />
                <div className="border-t border-ef-bg2 px-2.5 py-1 bg-ef-bg">
                  <span className="text-[10px] text-ef-dim">{formatShortDate(final.date)} · MetLife</span>
                </div>
              </div>
            </Link>
          )}
          <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mt-4 text-center">3rd Place</div>
          {third && <MatchCard match={third} />}
        </div>

        {/* RIGHT HALF: SF → QF → R16 → R32 */}
        <div className="flex items-center gap-0">
          {/* SF2 */}
          <div className="flex flex-col gap-2 mx-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">SF</div>
            {sf2 && <MatchCard match={sf2} />}
          </div>

          {/* QF Right */}
          <div className="flex flex-col gap-6 mx-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">QF</div>
            <RoundColumn matches={qfRight} side="right" hasConnector />
          </div>

          {/* R16 Right */}
          <div className="flex flex-col gap-6 mx-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">R16</div>
            <RoundColumn matches={r16Right} side="right" hasConnector />
          </div>

          {/* R32 Right */}
          <div className="flex flex-col gap-6 ml-4">
            <div className="text-[10px] font-medium tracking-widest uppercase text-ef-dim mb-2 text-center">R32</div>
            <RoundColumn matches={r32Right} side="right" />
          </div>
        </div>

      </div>
    </div>
  );
}
