"""Alerta Estudiantil API - sirve KPIs y stats desde SPADIES silver layer."""
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware



def normalize_text(text: str) -> str:
    """Quita tildes y normaliza texto para matching (metodologia == metodologia con tilde)."""
    if not text:
        return text
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join([c for c in nfkd if not unicodedata.combining(c)])


app = FastAPI(
    title="Alerta Estudiantil API",
    version="0.2.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*",
        "https://alerta-estuantil.leomoslab.com"
    ,
        "https://alerta-estudiantil.leomoslab.com"
    ],  # TODO: en prod usar dominio exacto (Spaceship)
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar SPADIES parquet en memoria al arranque (88 KB, ~10k filas)
SPADIES_PARQUET = Path(__file__).parent.parent.parent / "etl" / "data" / "silver" / "spadies.parquet"
df_spadies = pd.read_parquet(SPADIES_PARQUET)

LATEST_YEAR_TDA_TAI = int(df_spadies[df_spadies["metric"].isin(["TDA", "TAI"])]["ano"].max())
LATEST_YEAR_TDCA_TGA = int(df_spadies[df_spadies["metric"].isin(["TDCA", "TGA"])]["ano"].max())


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "alerta-api",
        "rows_loaded": len(df_spadies),
        "spadies_parquet": str(SPADIES_PARQUET),
    }


@app.get("/kpi")
async def kpi_nacional():
    """KPIs nacionales mas recientes (TDA, TAI, TDCA, TGA + variacion vs ano anterior)."""
    kpis = {}
    for metric, latest_year in [
        ("TDA", LATEST_YEAR_TDA_TAI),
        ("TAI", LATEST_YEAR_TDA_TAI),
        ("TDCA", LATEST_YEAR_TDCA_TGA),
        ("TGA", LATEST_YEAR_TDCA_TGA),
    ]:
        df_metric = df_spadies[
            (df_spadies["metric"] == metric)
            & (df_spadies["dimension"] == "nivel_formacion")
            & (df_spadies["dimension_value"] == "Total general")
        ]
        if len(df_metric) == 0:
            continue

        latest_value = float(df_metric[df_metric["ano"] == latest_year]["valor"].iloc[0])
        prev_year = latest_year - 1
        prev_df = df_metric[df_metric["ano"] == prev_year]
        prev_value = float(prev_df["valor"].iloc[0]) if len(prev_df) > 0 else None
        delta = (latest_value - prev_value) if prev_value is not None else None

        kpis[metric] = {
            "latest_year": latest_year,
            "value_pct": round(latest_value, 2),
            "previous_year_value_pct": round(prev_value, 2) if prev_value is not None else None,
            "delta_pp": round(delta, 2) if delta is not None else None,
        }

    return {
        "kpis": kpis,
        "source": "SPADIES - Ministerio de Educacion Nacional, Colombia",
        "total_rows_loaded": len(df_spadies),
    }


@app.get("/stats/nivel")
async def stats_nivel(metric: str = Query("TDA", description="Metrica: TDA, TAI, TDCA, TGA")):
    """Serie temporal por nivel de formacion (2010-2024)."""
    df_filtered = df_spadies[
        (df_spadies["metric"] == metric)
        & (df_spadies["dimension"] == "nivel_formacion")
    ]

    series = {}
    for nivel in df_filtered["dimension_value"].unique():
        df_nivel = df_filtered[df_filtered["dimension_value"] == nivel].sort_values("ano")
        series[nivel] = [
            {"ano": int(row["ano"]), "valor_pct": round(float(row["valor"]), 2)}
            for _, row in df_nivel.iterrows()
        ]

    return {
        "metric": metric,
        "dimension": "nivel_formacion",
        "series": series,
        "source": "SPADIES - Ministerio de Educacion Nacional, Colombia",
    }


@app.get("/stats/dimension/{dimension}")
async def stats_by_dimension(
    dimension: str,
    metric: str = Query("TDA", description="Metrica: TDA, TAI, TDCA, TGA"),
    ano: Optional[int] = Query(None, description="Ano especifico. Default: el mas reciente"),
):
    """Retorna valores por cualquier dimension (sexo, sector, area_conocimiento, departamento, metodologia) para una metrica y ano."""
    # Normalizar dimension (quitar tildes) para matching con data
    dimension = normalize_text(dimension)
    
    if ano is None:
        ano = int(df_spadies[df_spadies["dimension"] == dimension]["ano"].max())

    df_filtered = df_spadies[
        (df_spadies["metric"] == metric)
        & (df_spadies["dimension"] == dimension)
        & (df_spadies["ano"] == ano)
    ]

    # Aggregate by label (multiple values per label due to hierarchical sheets - one per nivel formacion)
    # Average across secciones to get a representative value per label
    grouped = df_filtered.groupby("dimension_value")["valor"].mean().reset_index()
    data = [
        {"label": row["dimension_value"], "valor_pct": round(float(row["valor"]), 2)}
        for _, row in grouped.iterrows()
    ]
    data.sort(key=lambda x: x["valor_pct"], reverse=True)

    return {
        "metric": metric,
        "dimension": dimension,
        "ano": ano,
        "data": data,
        "source": "SPADIES - Ministerio de Educacion Nacional, Colombia",
    }


@app.get("/stats/metricas")
async def metricas_disponibles():
    """Lista de metricas y dimensiones disponibles."""
    return {
        "metricas": list(df_spadies["metric"].unique()),
        "dimensiones": list(df_spadies["dimension"].unique()),
        "anos_tda_tai": sorted(df_spadies[df_spadies["metric"] == "TDA"]["ano"].unique().tolist()),
        "anos_tdca_tga": sorted(df_spadies[df_spadies["metric"] == "TDCA"]["ano"].unique().tolist()),
        "total_rows": len(df_spadies),
    }
