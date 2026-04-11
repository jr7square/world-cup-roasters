"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Everforest sequence — most distinct first, gray last (Other)
const LEAGUE_COLORS = [
  "#7FBBB3", // ef-blue
  "#A7C080", // ef-green
  "#DBBC7F", // ef-yellow
  "#E67E80", // ef-red
  "#D699B6", // ef-purple
  "#83C092", // ef-aqua
  "#E69875", // ef-orange
  "#4F585E", // ef-bg4 (Other)
];

const TOOLTIP_STYLE = {
  backgroundColor: "#343F44",
  border: "1px solid #3D484D",
  borderRadius: 6,
  fontSize: 12,
};

interface Props {
  data: Record<string, number | string>[];
  leagues: string[];
}

export default function LeagueChart({ data, leagues }: Props) {
  return (
    <div className="rounded-md border border-ef-bg2 bg-ef-bg1 p-5">
      <p className="text-xs font-medium tracking-widest uppercase text-ef-dim mb-5">
        Top leagues
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#3D484D" vertical={false} />
          <XAxis dataKey="year" stroke="#475258" tick={{ fill: "#859289", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#475258" tick={{ fill: "#859289", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "#D3C6AA", marginBottom: 4 }}
            itemStyle={{ color: "#D3C6AA" }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#859289", paddingTop: 12 }}
            formatter={(v) => (v.length > 24 ? v.slice(0, 22) + "…" : v)}
          />
          {leagues.map((league, i) => (
            <Bar
              key={league}
              dataKey={league}
              stackId="a"
              fill={LEAGUE_COLORS[Math.min(i, LEAGUE_COLORS.length - 1)]}
              radius={i === leagues.length - 1 ? [3, 3, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
