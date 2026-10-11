const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface KPI {
  latest_year: number;
  value_pct: number;
  previous_year_value_pct: number | null;
  delta_pp: number | null;
}

export interface KPIResponse {
  kpis: Record<string, KPI>;
  source: string;
  total_rows_loaded: number;
}

export interface NivelPoint {
  ano: number;
  valor_pct: number;
}

export interface StatsNivelResponse {
  metric: string;
  dimension: string;
  series: Record<string, NivelPoint[]>;
  source: string;
}

export async function fetchKPIs(): Promise<KPIResponse> {
  const res = await fetch(API_URL + "/kpi");
  if (!res.ok) throw new Error("Failed to fetch KPIs");
  return res.json();
}

export async function fetchStatsNivel(metric: string = "TDA"): Promise<StatsNivelResponse> {
  const res = await fetch(API_URL + "/stats/nivel?metric=" + metric);
  if (!res.ok) throw new Error("Failed to fetch stats nivel");
  return res.json();
}
