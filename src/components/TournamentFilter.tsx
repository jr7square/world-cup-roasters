"use client";

// Year accent colors following the pattern from CLAUDE.md:
// 1994=ef-blue, 1998=ef-green, 2002=ef-yellow, then continuing the palette
const YEAR_COLORS: Record<number, string> = {
  1994: "#7FBBB3", // ef-blue
  1998: "#A7C080", // ef-green
  2002: "#DBBC7F", // ef-yellow
  2006: "#E69875", // ef-orange
  2010: "#D699B6", // ef-purple
  2014: "#83C092", // ef-aqua
  2018: "#E67E80", // ef-red
  2022: "#DDD0B3", // ef-fg
};

interface Props {
  years: number[];
  selected: number[];
  onChange: (years: number[]) => void;
}

export default function TournamentFilter({ years, selected, onChange }: Props) {
  function toggle(year: number) {
    if (selected.includes(year)) {
      onChange(selected.filter((y) => y !== year));
    } else {
      onChange([...selected, year].sort((a, b) => a - b));
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {years.map((year) => {
        const color = YEAR_COLORS[year] ?? "#9DA89D";
        const active = selected.includes(year);
        return (
          <button
            key={year}
            onClick={() => toggle(year)}
            style={
              active
                ? { backgroundColor: color, color: "#1E2326", borderColor: color }
                : { color: color, borderColor: color }
            }
            className="px-3 py-1 rounded text-xs font-semibold border transition-colors"
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
