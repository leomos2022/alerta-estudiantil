"""Transforma bronze CSV a silver parquet con Pandera validation.

Limpia nombres de columnas (Socrata los mangla con _) y valida esquema.
"""
from pathlib import Path

import pandas as pd
import pandera as pa
from pandera.typing import Series

BRONZE = Path(__file__).parent.parent.parent / "data" / "bronze"
SILVER = Path(__file__).parent.parent.parent / "data" / "silver"

COLUMN_MAP = {
    "c_digo_de_la_instituci_n": "codigo_institucion",
    "ies_padre": "ies_padre",
    "instituci_n_de_educaci_n_superior_ies": "nombre_ies",
    "principal_oseccional": "principal_seccional",
    "id_sector": "id_sector",
    "id_caracter": "id_caracter",
    "c_digo_del_departamento_ies": "codigo_departamento_ies",
    "departamento_de_domicilio_de_la_ies": "departamento_ies",
    "c_digo_del_municipio_ies": "codigo_municipio_ies",
    "municipio_dedomicilio_de_la_ies": "municipio_ies",
    "c_digo_snies_delprograma": "codigo_snies_programa",
    "programa_acad_mico": "programa_academico",
    "id_nivel": "id_nivel",
    "id_nivel_formacion": "id_nivel_formacion",
    "id_metodologia": "id_metodologia",
    "id_area": "id_area",
    "id_nucleo": "id_nucleo",
    "n_cleo_b_sico_del_conocimiento_nbc": "nucleo_conocimiento",
    "c_digo_del_departamento_programa": "codigo_departamento_programa",
    "departamento_de_oferta_del_programa": "departamento_programa",
    "c_digo_del_municipio_programa": "codigo_municipio_programa",
    "municipio_de_oferta_del_programa": "municipio_programa",
    "id_g_nero": "id_genero",
    "a_o": "ano",
    "semestre": "semestre",
    "matriculados_2015": "matriculados",
}


class MatriculaSchema(pa.DataFrameModel):
    codigo_institucion: Series[int] = pa.Field(ge=1000, le=9999, nullable=False)
    nombre_ies: Series[str] = pa.Field(nullable=False)
    codigo_snies_programa: Series[int] = pa.Field(ge=1, nullable=False)
    programa_academico: Series[str] = pa.Field(nullable=False)
    ano: Series[int] = pa.Field(ge=2015, le=2025, nullable=False)
    semestre: Series[int] = pa.Field(isin=[1, 2], nullable=False)
    matriculados: Series[int] = pa.Field(ge=0, nullable=False)
    id_genero: Series[int] = pa.Field(isin=[1, 2], nullable=False)


def transform_matricula():
    bronze_path = BRONZE / "men_matricula_estadistica_es.csv"
    silver_path = SILVER / "matricula.parquet"
    silver_path.parent.mkdir(parents=True, exist_ok=True)

    print("Leyendo " + bronze_path.name + "...")
    df = pd.read_csv(bronze_path, low_memory=False)
    print("  Filas: " + str(len(df)))
    print("  Columnas originales: " + str(len(df.columns)))

    df = df.rename(columns=COLUMN_MAP)
    print("  Columnas renombradas: " + str(len(df.columns)))

    print("Validando con Pandera...")
    try:
        df = MatriculaSchema.validate(df, lazy=True)
        print("  OK: Schema validado")
    except pa.errors.SchemaErrors as e:
        n_failures = len(e.failure_cases)
        print("  " + str(n_failures) + " validaciones fallaron (primeras 10):")
        for f in e.failure_cases.head(10).to_dict(orient="records"):
            print("    - " + str(f))

    df.to_parquet(silver_path, index=False, compression="snappy")
    size_mb = silver_path.stat().st_size / 1024 / 1024
    print("  Guardado en: " + str(silver_path))
    print("  Tamano parquet: " + str(round(size_mb, 2)) + " MB (vs 80 MB CSV)")

    return df


if __name__ == "__main__":
    print("=== Transformando bronze -> silver ===\n")
    df = transform_matricula()
    print("\n=== Resultado ===")
    print("Filas en silver: " + str(len(df)))
    anos = sorted(df['ano'].unique())
    print("Anos: " + str(anos))
    total_mat = df['matriculados'].sum()
    print("Matriculados totales: " + str(total_mat))
    cols_preview = list(df.columns)[:8]
    print("Columnas silver (primeras 8): " + str(cols_preview))
