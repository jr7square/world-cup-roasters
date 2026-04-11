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
  GK: number;
  DF: number;
  MF: number;
  FW: number;
}

interface Props {
  data: DataPoint[];
}

const COLORS = {
  GK: "#fbbf24",
  DF: "#60a5fa",
  MF: "#34d399",
  FW: "#f87171",
};

export default function PositionChart({ data }: Props) {
  const chartData = data.map((d) => ({ ...d, year: String(d.year) }));
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Position Distribution
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
          <Bar dataKey="GK" fill={COLORS.GK} name="GK" radius={[3, 3, 0, 0]} />
          <Bar dataKey="DF" fill={COLORS.DF} name="DF" radius={[3, 3, 0, 0]} />
          <Bar dataKey="MF" fill={COLORS.MF} name="MF" radius={[3, 3, 0, 0]} />
          <Bar dataKey="FW" fill={COLORS.FW} name="FW" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
