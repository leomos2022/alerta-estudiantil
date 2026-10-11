"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchKPIs, fetchStatsNivel, fetchStatsDimension } from "@/lib/api";
import { Hero } from "@/components/Hero";
import { KPICard } from "@/components/KPICard";
import { EvolutionChart } from "@/components/EvolutionChart";
import { BarChartComponent } from "@/components/BarChart";
import { HorizontalBarChart } from "@/components/HorizontalBarChart";
import { RiskFactors } from "@/components/RiskFactors";

const METRIC_INFO: Record<string, { label: string; description: string }> = {
  TDA: { label: "Tasa de Desercion Anual", description: "% estudiantes que abandonan por ano" },
  TAI: { label: "Tasa de Ausencia Intersemestral", description: "% no se matriculan consecutivo" },
  TDCA: { label: "Tasa de Desercion Cohorte Acumulada", description: "Acumulado por cohorte" },
  TGA: { label: "Tasa de Graduacion Acumulada", description: "% que se graduan" },
};

export default function Home() {
  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ["kpis"],
    queryFn: fetchKPIs,
  });

  const { data: nivelData, isLoading: nivelLoading } = useQuery({
    queryKey: ["stats-nivel", "TDA"],
    queryFn: () => fetchStatsNivel("TDA"),
  });

  const { data: sectorData } = useQuery({
    queryKey: ["stats-dim", "sector"],
    queryFn: () => fetchStatsDimension("sector", "TDA"),
  });

  const { data: sexoData } = useQuery({
    queryKey: ["stats-dim", "sexo"],
    queryFn: () => fetchStatsDimension("sexo", "TDA"),
  });

  const { data: metodologiaData } = useQuery({
    queryKey: ["stats-dim", "metodologia"],
    queryFn: () => fetchStatsDimension("metodologia", "TDA"),
  });

  const { data: departamentoData } = useQuery({
    queryKey: ["stats-dim", "departamento"],
    queryFn: () => fetchStatsDimension("departamento", "TDA"),
  });

  if (kpiLoading || nivelLoading || !sectorData || !sexoData || !metodologiaData || !departamentoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <div className="text-zinc-400">Cargando datos oficiales SPADIES...</div>
      </div>
    );
  }

  const tdaKpi = kpiData?.kpis?.TDA;

  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Hero tda={tdaKpi?.value_pct || 9.78} year={tdaKpi?.latest_year || 2024} />

      <section id="kpi" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">La magnitud del problema</h2>
            <p className="text-zinc-300">Indicadores oficiales del SPADIES - Ministerio de Educacion Nacional</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData && Object.entries(kpiData.kpis).map(([metric, kpi]) => {
              const info = METRIC_INFO[metric];
              if (!info) return null;
              return (
                <KPICard
                  key={metric}
                  metric={metric}
                  label={info.label}
                  description={info.description}
                  value={kpi.value_pct}
                  year={kpi.latest_year}
                  delta={kpi.delta_pp}
                  previousValue={kpi.previous_year_value_pct}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section id="evolution" className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Evolucion 2010-2024</h2>
            <p className="text-zinc-300">Tasa de Desercion Anual por nivel de formacion</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            {nivelData && <EvolutionChart series={nivelData.series} />}
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Fuente: SPADIES - Ministerio de Educacion Nacional - Corte estadistico 2025
          </p>
        </div>
      </section>

      <section id="radiografia" className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Radiografia del desertor</h2>
            <p className="text-zinc-300">Tasa de Desercion Anual 2024 por distintas dimensiones (promedio entre niveles de formacion)</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Por sector</h3>
              <p className="text-xs text-zinc-400 mb-4">Oficial vs Privado</p>
              {sectorData && <BarChartComponent data={sectorData.data} />}
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Por sexo</h3>
              <p className="text-xs text-zinc-400 mb-4">Hombre vs Mujer</p>
              {sexoData && <BarChartComponent data={sexoData.data} />}
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Por metodologia</h3>
              <p className="text-xs text-zinc-400 mb-4">Presencial, Virtual, Distancia, Dual</p>
              {metodologiaData && <BarChartComponent data={metodologiaData.data} />}
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Fuente: SPADIES - MEN - Corte estadistico 2025 - Valores promedio entre secciones por nivel de formacion
          </p>
        </div>
      </section>

      <section id="donde" className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Donde desertan?</h2>
            <p className="text-zinc-300">Top 10 y Bottom 10 departamentos por TDA 2024</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Top 10 departamentos</h3>
              <p className="text-xs text-zinc-400 mb-4">Mayor tasa de desercion anual</p>
              {departamentoData && <HorizontalBarChart data={departamentoData.data} limit={10} />}
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Bottom 10 departamentos</h3>
              <p className="text-xs text-zinc-400 mb-4">Menor tasa de desercion anual</p>
              {departamentoData && (
                <HorizontalBarChart data={[...departamentoData.data].reverse()} limit={10} />
              )}
            </div>
          </div>
          <div className="mt-6 bg-amber-400/10 border border-amber-400/30 rounded-lg p-4">
            <p className="text-sm text-amber-300">
              <strong>Nota:</strong> Departamentos pequenos (Guainia, Vaupes, etc.) pueden mostrar tasas extremas
              debido al bajo numero de programas/estudiantes. Alta varianza estadistica, no necesariamente crisis.
            </p>
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            Fuente: SPADIES - MEN - Corte estadistico 2025
          </p>
        </div>
      </section>

      <section id="porque" className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Por que desertan?</h2>
            <p className="text-zinc-300">Los 3 factores de riesgo identificados por el SPADIES</p>
          </div>
          <RiskFactors />
          <div className="mt-8 bg-amber-400/10 border border-amber-400/30 rounded-lg p-6">
            <p className="text-sm text-amber-300">
              <strong>Importante:</strong> El SPADIES no solo mide la desercion pasada, sino que sirve como
              herramienta de <strong>alerta temprana</strong>. Las IES pueden identificar estudiantes en alto riesgo
              y activar rutas de apoyo (psicologico, economico o academico) antes de que el estudiante tome la
              decision de retirarse.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-zinc-900 text-center">
        <p className="text-sm text-zinc-400">
          Investigacion por Leonardo Mosquera - Ingeniero de Software y Analista de Datos
        </p>
      </footer>
    </main>
  );
}
