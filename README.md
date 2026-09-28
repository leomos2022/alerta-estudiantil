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
