"""Descubre datasets del SNIES disponibles en datos.gov.co."""
import asyncio
import json
import os

import httpx


async def search_datasets(query: str = "SNIES", limit: int = 50):
    """Busca datasets en el catalogo de datos.gov.co por palabra clave."""
    url = "https://www.datos.gov.co/api/catalog/v1"
    params = {"q": query, "limit": limit}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


async def main():
    queries = ["SNIES", "matriculados educacion superior", "graduados educacion superior"]
    all_results = []
    seen = set()

    for q in queries:
        print(f"\nBuscando: {q}")
        data = await search_datasets(q)
        results = data.get("results", [])
        print(f"  Encontrados: {len(results)}")
        for r in results:
            rid = r.get("resource", {}).get("id", "")
            if rid in seen:
                continue
            seen.add(rid)
            all_results.append({
                "id": rid,
                "name": r.get("resource", {}).get("name", "Sin nombre"),
                "type": r.get("resource", {}).get("type", ""),
                "updated_at": r.get("resource", {}).get("updatedAt", ""),
                "page_url": r.get("permalink", ""),
                "download_url": r.get("link", ""),
            })

    print(f"\n=== Total unicos: {len(all_results)} ===\n")
    for r in all_results[:30]:
        print(f"- [{r['id']}] {r['name'][:80]}")
        print(f"  URL: {r['page_url']}")

    os.makedirs("data/bronze/_meta", exist_ok=True)
    with open("data/bronze/_meta/datasets_discovered.json", "w") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"\nGuardado en data/bronze/_meta/datasets_discovered.json")


if __name__ == "__main__":
    asyncio.run(main())
