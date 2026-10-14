# Como construi Alerta Estudiantil Colombia con datos oficiales del MEN

## Por Leonardo Mosquera - Ingeniero de Software y Analista de Datos

---

**1 de cada 2 estudiantes que entra a la universidad en Colombia no se gradua.**

No es una opinion. Es un dato oficial del SPADIES (Sistema para la Prevencion de la Desercion de la Educacion Superior), administrado por el Ministerio de Educacion Nacional.

En 4 dias construi una plataforma web que centraliza 15 anos de datos oficiales (2010-2024), los limpia, valida y visualiza mediante storytelling interactivo. Este articulo explica como lo hice.

---

## El problema

Colombia tiene una de las tasas de desercion universitaria mas altas de America Latina:

- **TDA (Tasa de Desercion Anual) 2024**: 9.78% (1 de cada 10 abandona cada ano)
- **TDCA (Tasa de Desercion Cohorte Acumulada)**: ~46% (casi 1 de cada 2 no se gradua)
- **TAI (Tasa de Ausencia Intersemestral) 2024**: 13.92%
- ~490,000 estudiantes abandonan cada ano
- Perdida anual estimada: $4.9-12.2 billones COP

El SPADIES publica estos datos, pero estan en Excels complejos con estructura jerarquica, codificacion latin-1, y metadatos institucionales que dificultan su uso directo.

---

## La solucion

Construi **Alerta Estudiantil Colombia** (https://alerta-estudiantil.leomoslab.com), una plataforma que:

1. **Descarga automaticamente** los datos del SNIES y SPADIES desde datos.gov.co y el sitio oficial del MEN
2. **Limpia y valida** con Pandera (schema validation tipado = tests de calidad de datos)
3. **Almacena** en formato parquet (99.1% de reduccion de tamano vs Excel crudo)
4. **Sirve** via API REST (FastAPI con 5 endpoints)
5. **Visualiza** mediante storytelling interactivo (Next.js 16 + 8 secciones)

---

## Arquitectura tecnica

Monorepo desacoplado en 3 servicios:

**ETL (Python 3.11 + uv + Pandas 3 + Pandera + Prefect 3)**
- Bronze layer: CSVs crudos del SNIES (390k filas, 80MB)
- Silver layer: Parquet limpio + validado (8934 filas, 88KB)
- Discovery automatico de datasets via Socrata API
- Descarga paginada con $limit=50000 (maneja 390k+ filas)

**API (FastAPI 0.141 + uvicorn + pandas)**
- 5 endpoints: /health, /kpi, /stats/nivel, /stats/dimension/*, /stats/metricas
- Carga parquet en memoria al arranque (88KB, respuesta <50ms)
- CORS configurado para produccion
- Deploy en Render (free tier)

**Frontend (Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + Recharts)**
- 8 secciones de storytelling con datos REALES
- Navbar sticky con smooth scroll
- Animaciones con framer-motion
- Responsive + accesible (WCAG AA, skip-to-content, aria-labels)
- Deploy en Vercel con dominio personalizado

**CI/CD**: GitHub Actions con ruff (lint) + next build, cache uv + pnpm

---

## Hallazgos clave del analisis

### 1. El dataset de datos.gov.co tiene un bug silencioso

El dataset de matriculados del SNIES en datos.gov.co muestra una caida del 50% en 2020-2021. Inicialmente pense que era COVID. Pero al analizar mas profundo:

- IES que reportaron: estables (315-325 todos los anos)
- Programas unicos: crecieron de 9.3k (2015) a 12.3k (2021)
- Promedio de matriculados por fila: estable (~65-70)

**Conclusion**: la caida se debe a dataset incompleto en datos.gov.co, NO a matriculados reales. El SPADIES oficial (descargado del MEN directamente) SI tiene datos completos para 2020-2021.

Esto es un hallazgo critico que demuestra analisis de calidad de datos, no solo visualizacion.

### 2. El SPADIES oficial tiene 15 anos de datos (2010-2024)

Logre encontrar y descargar los Excels oficiales del SPADIES desde el sitio del MEN. Contienen:
- 4 metricas: TDA, TAI, TDCA, TGA
- 6 dimensiones: sexo, sector, metodologia, area de conocimiento, departamento, nivel de formacion
- 8934 filas en formato long (listo para analisis)

### 3. Tecnico profesional tiene la tasa mas alta de desercion

- Universitario: ~9% (estable, el mas bajo)
- Tecnologico/Tecnico (TyT): ~14-16%
- Tecnico profesional: ~17-22% (el mas alto)

### 4. Cambio metodologico 2019

Desde 2019, el SPADIES excluyo al SENA del nivel tecnologico. Comparar 2018 vs 2019+ requiere ajuste metodologico.

---

## Decisiones tecnicas justificadas

| Decision | Razon |
|---|---|
| Python 3.11 + uv | Estabilidad, 10-100x mas rapido que pip |
| Pandera validation | Schema tipado = tests de calidad de datos |
| Parquet sobre CSV | 99.1% reduccion de tamano + tipado |
| Next.js 16 + Tailwind 4 | Estetica Vercel/Linear/Stripe |
| Render sobre Railway | Free tier sin tarjeta de credito |
| Scraping SPADIES | datos.gov.co no tiene dataset nacional de desercion |

---

## Pricing

El proyecto tiene 4 tiers de monetizacion:

| Tier | Precio COP | Audiencia |
|---|---|---|
| Estudiante | $29.900 | Estudiantes individuales |
| Profesional | $99.000 | Profesores, investigadores |
| Institucional | $299.000 | IES, facultades |
| Gobierno | $999.000 | Ministerios, secretarias |

---

## Links

- **Dashboard**: https://alerta-estudiantil.leomoslab.com
- **API**: https://alerta-estudiantil-api.onrender.com
- **Repo**: https://github.com/leomos2022/alerta-estudiantil
- **Autor**: Leonardo Mosquera - Ingeniero de Software y Analista de Datos

---

Si te interesa acceder a la investigacion completa + repositorio con datos curados, visita https://alerta-estudiantil.leomoslab.com#cta

Si tienes preguntas sobre la metodologia, arquitectura o hallazgos, dejame un comentario. Feliz de responder.
