"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  metric: string;
  label: string;
  description: string;
  value: number;
  year: number;
  delta: number | null;
  previousValue: number | null;
}

export function KPICard({ metric, label, description, value, year, delta, previousValue }: KPICardProps) {
  // For desercion metrics: UP is BAD (red), DOWN is GOOD (green)
  const isUp = delta !== null ? delta > 0 : false;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp ? "text-red-400" : "text-green-400";

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 p-6 hover:border-amber-400/50 transition">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className="text-amber-400 border-amber-400/30">
          {metric}
        </Badge>
        <span className="text-xs text-zinc-500">{year}</span>
      </div>
      <div className="text-4xl font-bold text-white mb-1">
        {value.toFixed(2)}%
      </div>
      <div className="text-sm font-medium text-zinc-100 mb-1 font-semibold">{label}</div>
      <div className="text-xs text-zinc-300 mb-3">{description}</div>
      {delta !== null && previousValue !== null && (
        <div className="flex items-center gap-2 text-xs">
          <TrendIcon className={"h-4 w-4 " + trendColor} />
          <span className={trendColor}>
            {delta > 0 ? "+" : ""}{delta.toFixed(2)} pp
          </span>
          <span className="text-zinc-400">vs {previousValue.toFixed(2)}% ({year - 1})</span>
        </div>
      )}
    </Card>
  );
}
