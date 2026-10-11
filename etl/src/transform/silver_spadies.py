"""Transforma SPADIES Excel a silver parquet - version robusta.

Detecta automaticamente la fila de headers (anos) en cada hoja.
Maneja NaN, strings y tipos mixtos.
"""
import warnings
from pathlib import Path

import pandas as pd

warnings.filterwarnings("ignore")

BRONZE = Path(__file__).parent.parent.parent / "data" / "bronze"
SILVER = Path(__file__).parent.parent.parent / "data" / "silver"

EXCEL_FILE = BRONZE / "spadies" / "recurso_19.xlsx"

SHEETS = [
    ("Tasa Deserción Anual (TD)", "TDA", "nivel_formacion"),
    ("TD - sexo", "TDA", "sexo"),
    ("TD - sector", "TDA", "sector"),
    ("TD - metodología", "TDA", "metodologia"),
    ("TD - área de conocimiento", "TDA", "area_conocimiento"),
    ("TD - departamento", "TDA", "departamento"),
    ("Tasa Ausencia Intersemest (TAI)", "TAI", "nivel_formacion"),
    ("TAI - sexo", "TAI", "sexo"),
    ("TAI - sector", "TAI", "sector"),
    ("TAI - metodología", "TAI", "metodologia"),
    ("TAI - área de conocimiento", "TAI", "area_conocimiento"),
    ("TAI - departamento", "TAI", "departamento"),
    ("Tasa deserción cohorte acumulad", "TDCA", "nivel_formacion"),
    ("TDCA- sexo", "TDCA", "sexo"),
    ("TDCA - sector", "TDCA", "sector"),
    ("TDCA - metodología", "TDCA", "metodologia"),
    ("TDCA - área de conocimiento", "TDCA", "area_conocimiento"),
    ("TDCA - departamento", "TDCA", "departamento"),
    ("Tasa graduación acumulada", "TGA", "nivel_formacion"),
    ("TGA- sexo", "TGA", "sexo"),
    ("TGA - sector", "TGA", "sector"),
    ("TGA - metodología", "TGA", "metodologia"),
    ("TGA - área de conocimiento", "TGA", "area_conocimiento"),
    ("TGA - departamento", "TGA", "departamento"),
]


def find_header_row(df_raw, max_scan=20):
    """Encuentra la fila que contiene los anos (2010-2030)."""
    for i in range(min(max_scan, len(df_raw))):
        row = df_raw.iloc[i]
        year_count = sum(1 for v in row if isinstance(v, (int, float)) and not pd.isna(v) and 2009 <= v <= 2030)
        if year_count >= 5:
            return i
    return None


def parse_sheet(excel_path, sheet_name, metric_code, dimension):
    """Parsea una hoja SPADIES de forma robusta."""
    df_raw = pd.read_excel(excel_path, sheet_name=sheet_name, header=None)

    header_idx = find_header_row(df_raw)
    if header_idx is None:
        return pd.DataFrame()

    df = pd.read_excel(excel_path, sheet_name=sheet_name, header=header_idx)
    df = df.dropna(how="all")

    first_col = df.columns[0]
    df = df.rename(columns={first_col: "dimension_value"})

    year_cols = []
    for c in df.columns[1:]:
        try:
            val = float(c) if not isinstance(c, str) else float(c.replace(".0", ""))
            if 2009 <= val <= 2030:
                year_cols.append(c)
        except (ValueError, TypeError):
            continue

    if not year_cols:
        return pd.DataFrame()

    df_long = df.melt(
        id_vars=["dimension_value"],
        value_vars=year_cols,
        var_name="ano",
        value_name="valor",
    )

    df_long["valor"] = pd.to_numeric(df_long["valor"], errors="coerce")
    df_long = df_long.dropna(subset=["valor"])

    # Filtrar artifacts: valores imposibles para porcentajes (0-100)
    df_long = df_long[(df_long["valor"] >= 0) & (df_long["valor"] <= 100)]

    # Filtrar sub-headers que se cuelan como data (texto del header en dimension_value)
    header_text_map = {
        "sexo": "Sexo",
        "sector": "Sector",
        "metodologia": "Metodologia",
        "departamento": "Departamento de oferta del programa",
        "area_conocimiento": "Area de conocimiento",
    }
    header_text = header_text_map.get(dimension, "")
    if header_text:
        df_long = df_long[~df_long["dimension_value"].str.contains(header_text, case=False, na=False)]

    df_long["ano"] = pd.to_numeric(df_long["ano"], errors="coerce")
    df_long = df_long.dropna(subset=["ano"])
    df_long["ano"] = df_long["ano"].astype(int)

    df_long["valor"] = df_long["valor"] * 100

    df_long["dimension_value"] = df_long["dimension_value"].astype(str).str.strip()
    df_long = df_long[df_long["dimension_value"].str.len() > 0]
    df_long = df_long[df_long["dimension_value"] != "nan"]

    df_long["metric"] = metric_code
    df_long["dimension"] = dimension

    return df_long[["metric", "dimension", "dimension_value", "ano", "valor"]]


def main():
    print("=== Parseando SPADIES Excel -> silver (robusto) ===\n")
    SILVER.mkdir(parents=True, exist_ok=True)

    all_dfs = []
    for sheet_name, metric, dimension in SHEETS:
        try:
            df = parse_sheet(EXCEL_FILE, sheet_name, metric, dimension)
            if len(df) > 0:
                all_dfs.append(df)
                print("OK " + metric + " - " + dimension + ": " + str(len(df)) + " filas")
            else:
                print("EMPTY " + metric + " - " + dimension)
        except Exception as e:
            print("FAIL " + sheet_name + ": " + str(e)[:80])

    if not all_dfs:
        print("No se parseo ninguna hoja!")
        return

    df_all = pd.concat(all_dfs, ignore_index=True)
    print("\nTotal filas silver: " + str(len(df_all)))

    out_path = SILVER / "spadies.parquet"
    df_all.to_parquet(out_path, index=False, compression="snappy")
    size_kb = out_path.stat().st_size / 1024
    print("Guardado en: " + str(out_path))
    print("Tamano: " + str(round(size_kb, 1)) + " KB")

    print("\n=== Preview (primeras 12 filas) ===")
    print(df_all.head(12).to_string())

    print("\n=== Estadisticas por metrica x dimension ===")
    stats = df_all.groupby(["metric", "dimension"]).agg(
        valores=("valor", "count"),
        min_ano=("ano", "min"),
        max_ano=("ano", "max"),
        dim_values=("dimension_value", "nunique"),
    )
    print(stats.to_string())


if __name__ == "__main__":
    main()
