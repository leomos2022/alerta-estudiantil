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


export interface DimensionDataPoint {
  label: string;
  valor_pct: number;
}

export interface StatsDimensionResponse {
  metric: string;
  dimension: string;
  ano: number;
  data: DimensionDataPoint[];
  source: string;
}

export async function fetchStatsDimension(
  dimension: string,
  metric: string = "TDA",
  ano?: number
): Promise<StatsDimensionResponse> {
  const params = new URLSearchParams({ metric });
  if (ano) params.append("ano", String(ano));
  const res = await fetch(API_URL + "/stats/dimension/" + dimension + "?" + params.toString());
  if (!res.ok) throw new Error("Failed to fetch dimension stats");
  return res.json();
}
