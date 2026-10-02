"""Descarga datasets del SNIES con paginacion para datasets grandes."""
import asyncio
import csv
import io
from pathlib import Path

import httpx

DATA_GOV_BASE = "https://www.datos.gov.co"
BRONZE_DIR = Path(__file__).parent.parent.parent / "data" / "bronze"
LIMIT = 50000

DATASETS = {
    "instituciones": {"id": "n5yy-8nav", "filename": "men_instituciones_ies.csv", "paginate": False},
    "matricula": {"id": "5wck-szir", "filename": "men_matricula_estadistica_es.csv", "paginate": True},
}


async def get_row_count(client, dataset_id):
    url = f"{DATA_GOV_BASE}/resource/{dataset_id}.json?$select=count(*)"
    r = await client.get(url, timeout=30)
    if r.status_code == 200:
        try:
            data = r.json()
            return int(data[0].get("count", 0)) if data else 0
        except Exception:
            return 0
    return 0


async def download_simple(client, dataset_id, out_path):
    url = f"{DATA_GOV_BASE}/resource/{dataset_id}.csv?$limit=50000"
    print(f"  URL: {url}")
    r = await client.get(url, timeout=60)
    r.raise_for_status()
    out_path.write_bytes(r.content)
    size_mb = out_path.stat().st_size / 1024 / 1024
    print(f"  OK ({size_mb:.2f} MB)")


async def download_paginated(client, dataset_id, out_path):
    total = await get_row_count(client, dataset_id)
    if total:
        print(f"  Total rows: {total:,}")
    
    headers_written = False
    total_downloaded = 0
    page = 0
    
    while True:
        offset = page * LIMIT
        url = f"{DATA_GOV_BASE}/resource/{dataset_id}.csv?$limit={LIMIT}&$offset={offset}"
        print(f"  Page {page + 1} (offset {offset:,}): ", end="", flush=True)
        
        r = await client.get(url, timeout=120)
        if r.status_code != 200:
            print(f"ERROR status {r.status_code}")
            break
        
        content = r.content.decode("utf-8", errors="replace")
        if not content.strip():
            print("empty - done")
            break
        
        rows = list(csv.reader(io.StringIO(content)))
        if not rows:
            break
        
        if not headers_written:
            with open(out_path, "w", encoding="utf-8", newline="") as f:
                csv.writer(f).writerows(rows)
            headers_written = True
            rows_in_batch = len(rows) - 1
        else:
            with open(out_path, "a", encoding="utf-8", newline="") as f:
                csv.writer(f).writerows(rows[1:])
            rows_in_batch = len(rows) - 1
        
        total_downloaded += rows_in_batch
        print(f"+{rows_in_batch:,} rows (total: {total_downloaded:,})")
        
        if rows_in_batch < LIMIT - 1:
            break
        page += 1
    
    if out_path.exists():
        size_mb = out_path.stat().st_size / 1024 / 1024
        print(f"  OK ({size_mb:.2f} MB, {total_downloaded:,} rows)")


async def main():
    print("=== Descargando datasets SNIES ===\n")
    BRONZE_DIR.mkdir(parents=True, exist_ok=True)
    
    async with httpx.AsyncClient(timeout=300, follow_redirects=True) as client:
        for name, info in DATASETS.items():
            print(f"[{name}] {info['id']}")
            out_path = BRONZE_DIR / info["filename"]
            try:
                if info.get("paginate"):
                    await download_paginated(client, info["id"], out_path)
                else:
                    await download_simple(client, info["id"], out_path)
            except Exception as e:
                print(f"  ERROR: {e}")
            print()
    
    print("=== Archivos en bronze/ ===")
    for f in sorted(BRONZE_DIR.glob("*.csv")):
        size_mb = f.stat().st_size / 1024 / 1024
        print(f"  {f.name}: {size_mb:.2f} MB")


if __name__ == "__main__":
    asyncio.run(main())
