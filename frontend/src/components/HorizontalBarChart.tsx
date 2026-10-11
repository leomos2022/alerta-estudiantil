"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface HorizontalBarChartProps {
  data: { label: string; valor_pct: number }[];
  limit?: number;
}

const COLORS = [
  "#EF4444", "#F87171", "#FB923C", "#FBBF24", "#FFB703",
  "#FFD60A", "#FCD34D", "#FDE68A", "#FEF3C7", "#2DD4BF",
];

export function HorizontalBarChart({ data, limit = 10 }: HorizontalBarChartProps) {
  const sorted = [...data].sort((a, b) => b.valor_pct - a.valor_pct).slice(0, limit);

  return (
    <ResponsiveContainer width="100%" height={Math.max(300, sorted.length * 40)}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={false} />
        <XAxis type="number" stroke="#a1a1aa" tickFormatter={(v) => v + "%"} />
        <YAxis type="category" dataKey="label" stroke="#a1a1aa" width={80} />
        <Tooltip
          contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }}
          labelStyle={{ color: "#FAFAFA" }}
          formatter={(value: any) => [Number(value).toFixed(2) + "%", "TDA"]}
        />
        <Bar dataKey="valor_pct" name="TDA" radius={[0, 4, 4, 0]}>
          {sorted.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
