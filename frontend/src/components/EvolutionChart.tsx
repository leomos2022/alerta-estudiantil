"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EvolutionChartProps {
  series: Record<string, { ano: number; valor_pct: number }[]>;
}

const COLORS: Record<string, string> = {
  "Total general": "#FFB703",
  "Universitario": "#2DD4BF",
  "TyT": "#EF4444",
  "Tecnico profesional": "#A78BFA",
  "Tecnologico": "#60A5FA",
};

export function EvolutionChart({ series }: EvolutionChartProps) {
  const years = new Set<number>();
  Object.values(series).forEach(points => {
    points.forEach(p => years.add(p.ano));
  });

  const data = Array.from(years).sort().map(year => {
    const row: Record<string, number | string> = { ano: year };
    Object.entries(series).forEach(([nivel, points]) => {
      const point = points.find(p => p.ano === year);
      if (point) row[nivel] = point.valor_pct;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
        <XAxis dataKey="ano" stroke="#71717A" />
        <YAxis stroke="#71717A" tickFormatter={(v) => v + "%"} />
        <Tooltip
          contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }}
          labelStyle={{ color: "#FAFAFA" }}
        />
        <Legend />
        {Object.keys(series).map((nivel) => (
          <Line
            key={nivel}
            type="monotone"
            dataKey={nivel}
            stroke={COLORS[nivel] || "#FFF"}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
