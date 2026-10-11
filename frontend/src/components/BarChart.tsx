"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BarChartComponentProps {
  data: { label: string; valor_pct: number }[];
  title?: string;
}

const BAR_COLORS = [
  "#FFB703", // amber
  "#EF4444", // red
  "#2DD4BF", // teal
  "#A78BFA", // purple
  "#60A5FA", // blue
  "#F472B6", // pink
  "#34D399", // green
  "#FB923C", // orange
];

export function BarChartComponent({ data, title }: BarChartComponentProps) {
  // Sort descending by value (already sorted by API, but ensure)
  const sorted = [...data].sort((a, b) => b.valor_pct - a.valor_pct);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={sorted} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
        <XAxis
          dataKey="label"
          stroke="#a1a1aa"
          angle={-25}
          textAnchor="end"
          height={70}
          interval={0}
        />
        <YAxis stroke="#a1a1aa" tickFormatter={(v) => v + "%"} />
        <Tooltip
          contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }}
          labelStyle={{ color: "#FAFAFA" }}
          formatter={(value: any) => [Number(value).toFixed(2) + "%", "TDA"]}
        />
        <Bar dataKey="valor_pct" name="TDA" radius={[4, 4, 0, 0]}>
          {sorted.map((_, index) => (
            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
