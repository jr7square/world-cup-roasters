import type { FormResult } from "@/types";

interface Props {
  form: FormResult[];
}

const RESULT_STYLES = {
  W: "bg-ef-green text-ef-bg font-semibold",
  D: "bg-ef-yellow text-ef-bg font-semibold",
  L: "bg-ef-red text-ef-bg font-semibold",
};

export default function FormBadge({ form }: Props) {
  if (form.length === 0) {
    return <span className="text-ef-dim text-xs">No data</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {form.map((r, i) => (
        <span
          key={i}
          className={`w-6 h-6 flex items-center justify-center rounded text-[11px] ${RESULT_STYLES[r.result]}`}
          title={`${r.result} ${r.goalsFor}–${r.goalsAgainst} vs ${r.opponent} (${r.competition})`}
        >
          {r.result}
        </span>
      ))}
    </div>
  );
}
