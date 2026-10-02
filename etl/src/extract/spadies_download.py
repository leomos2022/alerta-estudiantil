"""Descarga archivos oficiales del SPADIES desde el sitio del MEN.

URL fuente: https://www.mineducacion.gov.co/sistemasdeinformacion/1783/
Articulo: w3-article-415244.html (Estadisticas de desercion y permanencia)

Archivos descargados:
- recurso_18.xlsx (867 KB) - Datos por IES especifica
- recurso_19.xlsx (9.6 MB) - Datos nacionales por cortes
- metodologia.pdf (233 KB) - Documento cambio metodologico SPADIES 3
- 5 graficos PNG (charts oficiales del MEN)
"""
import asyncio
from pathlib import Path

import httpx

BASE_URL = "https://www.mineducacion.gov.co/sistemasdeinformacion/1783"
BRONZE_DIR = Path(__file__).parent.parent.parent / "data" / "bronze" / "spadies"

FILES = {
    "recurso_18.xlsx": "articles-415244_recurso_18.xlsx",
    "recurso_19.xlsx": "articles-415244_recurso_19.xlsx",
    "metodologia.pdf": "articles-415244_cambio_metodologico_spadies_3.pdf",
    "grafico_13.png": "articles-415244_recurso_13.png",
    "grafico_14.png": "articles-415244_recurso_14.png",
    "grafico_15.png": "articles-415244_recurso_15.png",
    "grafico_16.png": "articles-415244_recurso_16.png",
    "grafico_17.png": "articles-415244_recurso_17.png",
}


async def download_file(filename: str, source_filename: str) -> Path:
    out_path = BRONZE_DIR / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)

    url = f"{BASE_URL}/{source_filename}"
    print(f"Descargando {filename}...")
    print(f"  URL: {url}")

    async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
        r = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
        r.raise_for_status()
        out_path.write_bytes(r.content)

    size_kb = out_path.stat().st_size / 1024
    print(f"  OK ({size_kb:.0f} KB)\n")
    return out_path


async def main():
    print("=== Descargando archivos oficiales SPADIES ===\n")
    for fname, source_name in FILES.items():
        try:
            await download_file(fname, source_name)
        except Exception as e:
            print(f"  ERROR: {e}\n")

    print("=== Archivos descargados en bronze/spadies/ ===")
    for f in sorted(BRONZE_DIR.glob("*")):
        size_kb = f.stat().st_size / 1024
        print(f"  {f.name}: {size_kb:.0f} KB")


if __name__ == "__main__":
    asyncio.run(main())
