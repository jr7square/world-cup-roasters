"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  year: number;
  Tier1: number;
  Tier2: number;
  Tier3: number;
  Other: number;
}

interface Props {
  data: DataPoint[];
}

const COLORS = {
  Tier1: "#818cf8",
  Tier2: "#a78bfa",
  Tier3: "#c084fc",
  Other: "#6b7280",
};

export default function TierChart({ data }: Props) {
  const chartData = data.map((d) => ({ ...d, year: String(d.year) }));
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        League Tier Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barGap={2} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="year" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#d1d5db" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
          <Bar dataKey="Tier1" stackId="a" fill={COLORS.Tier1} name="Tier 1" />
          <Bar dataKey="Tier2" stackId="a" fill={COLORS.Tier2} name="Tier 2" />
          <Bar dataKey="Tier3" stackId="a" fill={COLORS.Tier3} name="Tier 3" />
          <Bar dataKey="Other" stackId="a" fill={COLORS.Other} name="Other" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
