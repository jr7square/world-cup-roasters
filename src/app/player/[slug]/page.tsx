import Link from "next/link";
import type { PlayerProfilesData, PlayerProfile } from "@/types";
import profilesJson from "@/data/player-profiles.json";

const profilesData = profilesJson as PlayerProfilesData;

export function generateStaticParams() {
  return Object.keys(profilesData.players).map((slug) => ({ slug }));
}

const POSITION_LABEL: Record<string, string> = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
};

const POSITION_COLOR: Record<string, string> = {
  GK: "text-ef-yellow border-ef-yellow/30 bg-ef-yellow/10",
  DF: "text-ef-blue   border-ef-blue/30   bg-ef-blue/10",
  MF: "text-ef-green  border-ef-green/30  bg-ef-green/10",
  FW: "text-ef-red    border-ef-red/30    bg-ef-red/10",
};

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player: PlayerProfile | undefined = profilesData.players[slug];

  if (!player) {
    return (
      <div className="min-h-screen bg-ef-bg text-ef-fg flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-4xl">⚽</p>
          <p className="text-ef-fg font-semibold">Player not found</p>
          <Link href="/" className="text-ef-blue text-sm hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const posColor = POSITION_COLOR[player.position] ?? "text-ef-dim border-ef-dim/30 bg-ef-dim/10";

  return (
    <div className="min-h-screen bg-ef-bg text-ef-fg">
      {/* Top bar */}
      <div className="border-b border-ef-bg2 px-6 py-4">
        <Link
          href="/"
          className="text-ef-dim text-sm hover:text-ef-fg transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span>
          <span>World Cup Roasters</span>
        </Link>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${posColor}`}>
              {POSITION_LABEL[player.position] ?? player.position}
            </span>
            <span className="text-ef-dim text-xs">{player.country}</span>
            {player.age && (
              <span className="text-ef-bg4 text-xs">Age {player.age}</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-ef-fg">{player.name}</h1>
          <p className="text-ef-dim text-sm">{player.club}</p>
        </div>

        {/* Profile */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium tracking-widest uppercase text-ef-dim">Profile</h2>
          <p className="text-ef-fg text-sm leading-relaxed">{player.profile}</p>
        </section>

        {/* Strengths & Weaknesses */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md border border-ef-bg2 p-4 space-y-2">
            <h3 className="text-xs font-medium tracking-widest uppercase text-ef-green">Strengths</h3>
            <ul className="space-y-1.5">
              {player.strengths.map((s, i) => (
                <li key={i} className="text-sm text-ef-fg flex gap-2">
                  <span className="text-ef-green mt-0.5 shrink-0">+</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-ef-bg2 p-4 space-y-2">
            <h3 className="text-xs font-medium tracking-widest uppercase text-ef-red">Weaknesses</h3>
            <ul className="space-y-1.5">
              {player.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-ef-fg flex gap-2">
                  <span className="text-ef-red mt-0.5 shrink-0">−</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Stats */}
        {player.stats && player.stats.rows.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium tracking-widest uppercase text-ef-dim">Stats</h2>
              <span className="text-ef-bg4 text-xs">{player.stats.label}</span>
            </div>
            <div className="rounded-md border border-ef-bg2 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {player.stats.rows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-ef-bg2/60 last:border-0 hover:bg-ef-bg1/60 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-ef-dim">{row.stat}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-ef-fg">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {player.fbrefUrl && (
              <p className="text-right">
                <a
                  href={player.fbrefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ef-blue hover:underline"
                >
                  View on FBref →
                </a>
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
