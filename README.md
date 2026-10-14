# Alerta Estudiantil Colombia

Investigacion independiente sobre desercion en la educacion superior colombiana.

## Estado
En desarrollo - Setup inicial

## Stack
- ETL: Python 3.11 + uv + Pandas + Pandera + Prefect
- API: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: Next.js 16 + Tailwind 4 + shadcn/ui

## Estructura
- etl/ - Pipeline de datos (Bronze -> Silver -> Gold)
- api/ - FastAPI con /kpi /stats /payments /webhook
- frontend/ - Next.js (storytelling de datos)
- infra/ - Docker compose para PostgreSQL
- docs/ - Documentacion

## Setup
Ejecutar: make install && make db

## Comandos
- make api - FastAPI en :8000
- make fe - Next.js en :3000
- make etl - ejecutar pipeline
- make test - tests


## Licencia

MIT License - ver `LICENSE` para detalles.

---

## Copyright

© 2026 Leonardo Mosquera. Todos los derechos reservados.

El codigo esta bajo MIT License. Los datos curados y analisis son propiedad de Leonardo Mosquera.
El uso comercial de este analisis requiere licencia expresa.

Los datos del SPADIES son publicos del Ministerio de Educacion Nacional.
Esta investigacion es independiente y no tiene relacion oficial con el MEN.

---

## Articulo de LinkedIn

**"Como construi Alerta Estudiantil Colombia con datos oficiales del MEN"**

Lee el articulo completo: https://www.linkedin.com/pulse/c%C3%B3mo-constru%C3%AD-alerta-estudiantil-colombia-con-datos-del-mosquera-cn4be