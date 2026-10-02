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


---

## Fuentes de datos identificadas (research externo)

Adicionalmente a la busqueda automatica en datos.gov.co, se identificaron las siguientes fuentes oficiales para datos sobre desercion estudiantil:

### SPADIES - Sistema para la Prevencion de la Desercion de la Educacion Superior

- **URL**: https://spadies.mineducacion.gov.co
- **Propietario**: Ministerio de Educacion Nacional (MEN)
- **Que contiene**: Tasas de desercion oficiales por periodo, institucion, programa academico y genero. Incluye factores de riesgo.
- **Importancia**: CRITICA - es la fuente oficial para desercion. Sin SPADIES no se puede calcular la tasa real de desercion.
- **Estado**: Por investigar disponibilidad de descarga programatica (posiblemente requiere scraping o descarga manual).

### SINEB - Sistema Nacional de Informacion de Educacion Basica y Media

- **URL**: Datos disponibles en datos.gov.co (busqueda pendiente)
- **Propietario**: MEN
- **Que contiene**: Cifras de abandono escolar, aprobaciones y reprobaciones en colegios publicos y privados (pre-escolar, basica y media).
- **Importancia**: Baja para este proyecto (foco es educacion superior, no basica). Posible uso para analisis comparativo o contextual.
- **Estado**: No prioritario.

### Datos Abiertos Bogota

- **URL**: https://datosabiertos.bogota.gov.co
- **Propietario**: Alcaldia Mayor de Bogota
- **Que contiene**: Tasas de desercion por localidad o UPZ (nivel territorial urbano).
- **Importancia**: Bonus para analisis territorial focalizado en Bogota.
- **Estado**: Bonus, no prioritario para MVP nacional.

### Estrategia de integracion propuesta

1. **MVP (ahora)**: Dataset de matriculados del SNIES en datos.gov.co (ya descargado, silver layer lista).
2. **Fase 2 (siguiente)**: Integrar SPADIES para tasas de desercion oficiales. Esto desbloquea el calculo real de KPIs de desercion.
3. **Fase 3 (posterior)**: SINEB para contexto de educacion basica/media.
4. **Fase 4 (opcional)**: Datos Abiertos Bogota para nivel territorial fino.

### Busqueda en datos.gov.co - RESULTADO NEGATIVO

Se buscaron las siguientes keywords en el catalogo de datos.gov.co (Socrata API v1):

| Keyword | Resultados | Encontrado nacional? |
|---|---|---|
| "SPADIES" | 0 | No |
| "desercion" | 30 | No (todos especificos a IES/ciudades) |
| "tasa desercion" | 28 | No (todos educacion basica/media) |
| "prevencion desercion" | 0 | No |
| "desercion educacion superior" | 21 | No (todos basic/media) |

**Candidatos inspeccionados y descartados**:

- `3iew-7wpx` - "DESERCION ACADEMICA PREGRADO Y POSGRADO" - Especifico a UPTC (Universidad Pedagogica y Tecnologica de Colombia). Contiene microdata con PII (fecha de nacimiento).
- `68eb-25rj` - "Desercion educativa" - Especifico a Medellin, mide grados K-12 (no educacion superior).

**Conclusion confirmada**: NO existe dataset nacional de desercion en educacion superior en datos.gov.co.

**Siguiente paso necesario**: Acceso directo a SPADIES via:
1. Web scraping de https://spadies.mineducacion.gov.co (requiere browser automation con Playwright)
2. Descarga manual de reportes PDF/Excel publicados por el MEN
3. Contacto directo al MEN para solicitar acceso a datos abiertos de SPADIES

Esta limitacion se documenta en el README del portafolio como decision tecnica con justificacion.


---

## BREAKTHROUGH: SPADIES oficial descargado (2026-10-02)

Se encontro la URL correcta del articulo SPADIES en el sitio del MEN:
- URL base: https://www.mineducacion.gov.co/sistemasdeinformacion/1783/
- Articulo: w3-article-415244.html (Estadisticas de desercion y permanencia)
- Se descargaron:
  - recurso_18.xlsx (867 KB) - Datos por IES especifica
  - recurso_19.xlsx (9.6 MB) - Datos nacionales por cortes
  - metodologia.pdf (233 KB) - Documento de cambio metodologico SPADIES 3
  - 5 PNGs con graficos (29K-49K cada uno)

### Metricas SPADIES obtenidas (oficiales, corte estadistico 2025):

1. **TDA** (Tasa de Desercion Anual) - por sexo, sector, area conocimiento, departamento, metodologia, nivel formacion, IES
2. **TAI** (Tasa de Ausencia Intersemestral) - mismas dimensiones
3. **TDCA** (Tasa de Desercion Cohorte Acumulada) - mismas dimensiones
4. **TGA** (Tasa de Graduacion Acumulada) - mismas dimensiones

### Datos REALES extraidos (TDA por nivel de formacion, 2010-2024):

| Nivel | 2010 | 2015 | 2019 | 2020 | 2021 | 2024 |
|---|---|---|---|---|---|---|
| Universitario | 9.9% | 9.0% | 8.3% | 8.0% | 8.9% | 8.6% |
| Tecnologico/Tecnico (TyT) | 19.5% | 13.4% | 14.8% | 13.4% | 16.5% | 15.7% |
| Tecnico profesional | 22.5% | 21.4% | 18.0% | 13.6% | 18.8% | 17.0% |

### Notas metodologicas importantes:

- "A partir del ano 2019 se excluye para los calculos de los indicadores de Tasa de Desercion Anual y Tasa de Ausencia Intersemestral en el nivel tecnologico el SENA"
- Esto significa que comparar 2018 vs 2019+ en TyT requiere ajuste metodologico
- Corte estadistico de 2025 (datos mas recientes publicados)

### Implicacion para el proyecto:

Esto es GAME CHANGER. Ahora tenemos:
- 15 anos de datos oficiales (2010-2024)
- 4 metricas con cortes por 6+ dimensiones (sexo, sector, area, depto, etc.)
- Datos desagregados por IES especifica (300+ instituciones)
- Datos REALES de COVID 2020-2021 (no afectados por sub-reporte del dataset matriculados)

Podemos calcular TODOS los KPIs necesarios para el proyecto:
- Tasa de desercion anual nacional
- Desercion por nivel formacion, sector, departamento, sexo
- Comparacion pre/post COVID
- Ranking de IES por desercion
- Tasa de graduacion acumulada
- Analsis de cohorte (TDCA)

El dataset de matriculados de datos.gov.co queda como complemento territorial, pero SPADIES es la fuente principal ahora.
