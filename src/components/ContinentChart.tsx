"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, type BarShapeProps } from "recharts";
import { CONTINENT_ORDER, type Continent } from "@/lib/data";

// Everforest palette per continent
const CONTINENT_COLORS: Record<Continent, string> = {
  Europe:          "#7FBBB3", // ef-blue
  "South America": "#A7C080", // ef-green
  "North America": "#DBBC7F", // ef-yellow
  Africa:          "#E69875", // ef-orange
  Asia:            "#D699B6", // ef-purple
  Oceania:         "#83C092", // ef-aqua
  Unknown:         "#4F585E", // ef-bg4
};

const TOOLTIP_STYLE = {
  backgroundColor: "#343F44",
  border: "1px solid #3D484D",
  borderRadius: 6,
  fontSize: 12,
};

// Transparent full-column rect to catch hover events for the entire bar height
function HoverTarget(props: BarShapeProps) {
  const bg = props.background;
  if (!bg || bg.x === null || bg.y === null) return null;
  return <rect x={bg.x} y={bg.y} width={bg.width} height={bg.height} fill="transparent" stroke="none" />;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number; fill: string; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const items = payload.filter((p) => p.dataKey !== "__hover__" && (p.value ?? 0) > 0);
  if (!items.length) return null;
  return (
    <div style={{ ...TOOLTIP_STYLE, padding: "8px 12px" }}>
      <p style={{ color: "#D3C6AA", marginBottom: 4, fontWeight: 500 }}>{label}</p>
      {items.map((item) => (
        <p key={item.dataKey} style={{ color: item.fill, margin: "2px 0" }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

interface Props {
  data: Record<string, number | string>[];
}

export default function ContinentChart({ data }: Props) {
  const active = CONTINENT_ORDER.filter((c) =>
    data.some((row) => (row[c] as number) > 0)
  );

  return (
    <div className="rounded-md border border-ef-bg2 bg-ef-bg1 p-5">
      <p className="text-xs font-medium tracking-widest uppercase text-ef-dim mb-5">
        Club continent
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#3D484D" vertical={false} />
          <XAxis dataKey="year" stroke="#475258" tick={{ fill: "#859289", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475258" tick={{ fill: "#859289", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            wrapperStyle={{ zIndex: 10 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: "#859289", paddingTop: 12, position: "relative", zIndex: 0 }} />
          {active.map((continent, i) => (
            <Bar
              key={continent}
              dataKey={continent}
              stackId="a"
              fill={CONTINENT_COLORS[continent]}
              radius={i === active.length - 1 ? [3, 3, 0, 0] : undefined}
            />
          ))}
          <Bar dataKey="__hover__" stackId="a" shape={HoverTarget} legendType="none" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
