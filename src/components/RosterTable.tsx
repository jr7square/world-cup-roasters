import type { TeamRoster } from "@/types";

const POSITION_STYLES: Record<string, { dot: string; label: string }> = {
  GK: { dot: "bg-ef-yellow",  label: "text-ef-yellow" },
  DF: { dot: "bg-ef-blue",    label: "text-ef-blue" },
  MF: { dot: "bg-ef-green",   label: "text-ef-green" },
  FW: { dot: "bg-ef-red",     label: "text-ef-red" },
};

const YEAR_ACCENT: Record<number, string> = {
  1994: "border-ef-blue   text-ef-blue",
  1998: "border-ef-green  text-ef-green",
  2002: "border-ef-yellow text-ef-yellow",
  2006: "border-ef-orange text-ef-orange",
  2010: "border-ef-purple text-ef-purple",
  2014: "border-ef-aqua   text-ef-aqua",
  2018: "border-ef-red    text-ef-red",
  2022: "border-ef-fg     text-ef-fg",
  2026: "border-ef-dim    text-ef-dim",
};

interface Props {
  year: number;
  roster: TeamRoster;
}

export default function RosterTable({ year, roster }: Props) {
  const accent = YEAR_ACCENT[year] ?? "border-ef-dim text-ef-dim";

  return (
    <div className="rounded-md overflow-hidden border border-ef-bg2">
      {/* Header */}
      <div className={`px-4 py-3 bg-ef-bg1 border-b border-ef-bg2 flex items-center gap-2`}>
        <span className={`text-sm font-semibold border-b-2 pb-0.5 ${accent}`}>
          {year}
        </span>
        <span className="text-ef-dim text-xs">
          Group {roster.group} &middot; {roster.players.length} players
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ef-dim text-xs border-b border-ef-bg2">
              <th className="px-3 py-2 text-right w-8 font-normal">#</th>
              <th className="px-3 py-2 w-10 font-normal" />
              <th className="px-3 py-2 text-left font-normal">Player</th>
              <th className="px-3 py-2 text-left font-normal hidden sm:table-cell">Club</th>

            </tr>
          </thead>
          <tbody>
            {roster.players.map((p, i) => {
              const pos = POSITION_STYLES[p.position];
              return (
                <tr
                  key={i}
                  className="border-b border-ef-bg2/60 last:border-0 hover:bg-ef-bg1/60 transition-colors"
                >
                  <td className="px-3 py-2 text-right text-ef-dim font-mono text-xs">
                    {p.number ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pos?.dot ?? "bg-ef-dim"}`} />
                      <span className={`text-xs font-medium ${pos?.label ?? "text-ef-dim"}`}>
                        {p.position}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-ef-fg">
                    <div>
                      <span>{p.name}</span>
                      {p.isCaptain && (
                        <span className="ml-1.5 text-[10px] text-ef-yellow font-semibold tracking-wide">
                          C
                        </span>
                      )}
                    </div>
                    {(p.club || p.clubCountry) && (
                      <div className="sm:hidden mt-0.5">
                        <span className="text-ef-dim text-xs">{p.club}</span>
                        {p.clubCountry && (
                          <span className="ml-1 text-ef-bg4 text-xs">{p.clubCountry}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 hidden sm:table-cell">
                    <span className="text-ef-dim text-xs">{p.club}</span>
                    {p.clubCountry && (
                      <span className="ml-1 text-ef-bg4 text-xs">{p.clubCountry}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
