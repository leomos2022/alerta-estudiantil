# Hallazgos de Investigacion - Alerta Estudiantil Colombia

Documentacion viva de hallazgos tecnicos y de datos. Se actualiza conforme avanza la investigacion.

---

## Cronologia

### Dia 1 - Setup tecnico (2026-09-28 a 2026-10-02)

#### Stack implementado

- **ETL**: Python 3.11 + uv + Pandas 3 + Pandera 0.33 + Prefect 3.8 + sodapy + httpx
- **API**: FastAPI 0.141 + uvicorn 0.54 + SQLAlchemy 2.1 + psycopg 3 + python-jose + resend
- **Frontend**: Next.js 16 + React 19 + Tailwind 4 + shadcn/ui 4.21 (Nova preset)
- **DB**: PostgreSQL 16 en Docker con schemas medallion (bronze, silver, gold, app, public)
- **CI**: GitHub Actions con ruff + next build, cache uv + pnpm (27s por run)

#### Decisiones tecnicas justificadas

| Decision | Razon | Alternativa descartada |
|---|---|---|
| Python 3.11 via uv | Estabilidad, compatibilidad con Pandera/Prefect | Anaconda 3.12 (mas conflictos) |
| Docker PostgreSQL en puerto 5434 | Sistema tenia PostgreSQL 15 (puerto 5432) y PostgreSQL 17 (puerto 5433) instalados | Detener PostgreSQLs del sistema (rompe otros proyectos) |
| shadcn con Base UI + Nova | Estetica Vercel/Linear/Stripe, React 19 nativo | Radix UI (legacy) |
| uv workspace monorepo | Aislamiento ETL/API, sync unico | venvs separados (mas complejo) |
| Pandas 3.0 | Performance, dtype backend moderno | Pandas 2.x (estable pero mas lento) |
| Socrata pagination $limit=50000 | Soporta 390k rows, robusto | Streaming directo (falla en datasets grandes) |

---

### Dia 2 - Descarga y EDA inicial (2026-10-02)

#### Datasets NACIONALES del MEN encontrados en datos.gov.co

| ID | Nombre | Filas | Tamaño |
|---|---|---|---|
| `n5yy-8nav` | MEN_INSTITUCIONES EDUCACION SUPERIOR | 361 | 0.13 MB |
| `5wck-szir` | MEN_MATRICULA_ESTADISTICA_ES | 390,903 | 80 MB |
| `5z5m-87g7` | VISTA_MEN_MATRICULA-ESTADISTICA | igual a 5wck-szir (mismos datos, mejores nombres) | - |

Otros 5 datasets del MEN encontrados son de educacion pre-escolar y basica (no relevantes para SNIES).

#### Dataset nacional de GRADUADOS - NO ENCONTRADO

Se buscaron con keywords: `MEN_GRADUADOS`, `graduados SNIES`, `titulados educacion superior`, `egresados`, `programas SNIES`, `MEN programas`.

Resultado: **No existe dataset nacional de graduados en datos.gov.co**. Solo hay datasets de universidades especificas (UNAL, Colegio Mayor, Universidad de Sucre, etc.).

El SNIES publica graduados en `snies.mineducacion.gov.co` como descargas anuales en Excel.

#### Resumen del dataset MEN_MATRICULA_ESTADISTICA_ES (matriculados)

| Metrica | Valor |
|---|---|
| Filas totales | 390,903 |
| Tamano archivo | 80 MB |
| Anos cubiertos | 2015-2021 (7 anos) |
| Semestres | 1, 2 |
| IES unicas | 338 (de 361 totales en el dataset de IES) |
| Programas unicos | 15,526 |
| Total matriculados (suma) | 28,745,704 |

#### Hallazgo critico: caida del 50% en 2020-2021

| Ano | Matriculados | Registros | IES reportaron | Programas unicos |
|---|---|---|---|---|
| 2015 | 4,587,100 | 59,146 | 315 | 9,286 |
| 2016 | 4,788,868 | 62,038 | 320 | 9,993 |
| 2017 | 4,892,628 | 65,464 | 312 | 10,382 |
| 2018 | 4,880,734 | 64,104 | 314 | 10,990 |
| 2019 | 4,792,500 | 70,864 | 316 | 11,627 |
| 2020 | 2,355,603 | 34,725 | 318 | 11,823 |
| 2021 | 2,448,271 | 34,562 | 325 | 12,290 |

**Hipotesis inicial**: caida por COVID-19 (pandemia marzo 2020).

**Hipotesis confirmada**: **NO es COVID real**. Evidencia:

- IES que reportaron se mantuvo estable (315-325)
- Programas unicos crecieron de 9.3k (2015) a 12.3k (2021)
- Promedio de matriculados por fila se mantuvo estable (~65-70)
- Solo 3 IES pequenas dejaron de reportar en 2020 (no explican el 50% drop)
  - FUNDACION CENTRO DE INVESTIGACION DOCENCIA Y CONSULTORIA ADMINISTRATIVA
  - FUNDACION POLITÉCNICO MINUTO DE DIOS - TEC MD
  - CORPORACION REGIONAL DE EDUCACION SUPERIOR-CRES-DE CALI

**Conclusion**: La caida se debe a **dataset incompleto en datos.gov.co** (no es matriculados reales). El SNIES actualiza datos anualmente y los datos de 2020-2021 en datos.gov.co parecen preliminares o incompletos. El impacto real del COVID en matriculados segun el MEN fue 5-15%, no 50%.

#### Implicacion para analisis

- Para 2015-2019: dataset confiable para trends
- Para 2020-2021: usar con cautela, no confiar en totales absolutos
- Para 2022-2023: no disponibles en este dataset (necesita descarga directa del SNIES)

#### Limpieza de columnas (necesaria en silver layer)

El CSV descargado tiene caracteres especiales reemplazados por `_` (consecuencia del CSV export de Socrata):

| Columna actual | Renombrar a |
|---|---|
| `c_digo_de_la_instituci_n` | `codigo_institucion` |
| `instituci_n_de_educaci_n_superior_ies` | `nombre_ies` |
| `c_digo_snies_delprograma` | `codigo_snies_programa` |
| `programa_acad_mico` | `programa_academico` |
| `a_o` | `ano` |
| `matriculados_2015` | `matriculados` (NO es especifico de 2015, es el conteo generico) |
| `id_g_nero` | `id_genero` |
| `n_cleo_b_sico_del_conocimiento_nbc` | `nucleo_conocimiento` |

---

## Limitaciones identificadas

1. **Sin dataset nacional de graduados** en datos.gov.co
   - Para calcular desercion, se necesita: matriculados - graduados - continuan
   - Sin graduados, no podemos calcular desercion real por cohorte
   - **Plan**: descargar graduados de snies.mineducacion.gov.co directamente

2. **Datos 2020-2021 potencialmente incompletos** en datos.gov.co
   - Verificar con SNIES oficial antes de publicar cifras
   - Evitar mostrar totales 2020-2021 como definitivos

3. **Datos 2022-2023 no disponibles** en este dataset
   - Necesita descarga manual del SNIES web (snies.mineducacion.gov.co)

---

## Pendientes

- [ ] Descargar dataset nacional de graduados desde snies.mineducacion.gov.co
- [ ] Construir silver layer con Pandera (rename columns, validate schemas)
- [ ] Construir gold layer con marts (kpi_nacional, desercion_nivel, etc.)
- [ ] Documentar metodologia de calculo de desercion por cohorte
- [ ] Crear API endpoint /kpi que retorne KPIs nacionales
- [ ] Construir frontend storytelling con datos reales
- [ ] Configurar Wompi para monetizacion ($29.900 - $999.000 COP en 4 tiers)

---

## Estrategia de monetizacion

| Tier | Precio COP | Audiencia | Incluye |
|---|---|---|---|
| Estudiante | 29.900 | Estudiantes individual | Repo read-only + PDF + CSV |
| Profesional | 99.000 | Profesores, consultores | Todo lo anterior + Parquet + dashboard 6 meses |
| Institucional | 299.000 | IES, facultades | Todo lo anterior + licencia interna 5 usuarios + 1h consultoria |
| Gobierno | 999.000 | Ministerios, secretarlas | Todo lo anterior + personalizacion + soporte 90 dias |

Calculo de inversion: ~200h trabajo = ~16M COP. Para recuperar $16M COP:
- A $29.900/cop: 535 ventas (alcanzable en 12 meses)
- A $99.000: 162 ventas (alcanzable en 6 meses)
- A $299.000: 54 ventas institucionales (factible en 12-18 meses)
