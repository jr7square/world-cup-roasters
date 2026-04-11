const YEAR_STYLES: Record<number, string> = {
  1994: "text-ef-blue  border border-ef-blue/30  bg-ef-blue/10",
  1998: "text-ef-green border border-ef-green/30 bg-ef-green/10",
  2002: "text-ef-yellow border border-ef-yellow/30 bg-ef-yellow/10",
};

interface OverlapPlayer {
  name: string;
  years: number[];
}

interface Props {
  players: OverlapPlayer[];
}

export default function PlayerOverlapTable({ players }: Props) {
  if (players.length === 0) return null;

  return (
    <div className="rounded-md overflow-hidden border border-ef-bg2">
      <div className="px-4 py-3 bg-ef-bg1 border-b border-ef-bg2 flex items-center gap-2">
        <span className="text-xs font-medium tracking-widest uppercase text-ef-dim">
          Multi-tournament players
        </span>
        <span className="text-ef-bg4 text-xs">{players.length}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ef-dim text-xs border-b border-ef-bg2">
            <th className="px-4 py-2 text-left font-normal">Player</th>
            <th className="px-4 py-2 text-left font-normal">Tournaments</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr
              key={i}
              className="border-b border-ef-bg2/60 last:border-0 hover:bg-ef-bg1/60 transition-colors"
            >
              <td className="px-4 py-2 text-ef-fg">{p.name}</td>
              <td className="px-4 py-2">
                <div className="flex gap-1.5 flex-wrap">
                  {p.years.map((y) => (
                    <span
                      key={y}
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${YEAR_STYLES[y] ?? "text-ef-dim border border-ef-bg3"}`}
                    >
                      {y}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
