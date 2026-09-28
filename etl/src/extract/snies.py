"""Extract minimo: descubre datasets disponibles en datos.gov.co."""
import asyncio

import httpx
from dotenv import load_dotenv

load_dotenv()


async def list_datasets():
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get("https://www.datos.gov.co/api/catalog/v1")
        r.raise_for_status()
        return r.json()


if __name__ == "__main__":
    data = asyncio.run(list_datasets())
    n = len(data.get("dataset", []))
    print(f"OK Conexion datos.gov.co. Encontrados {n} datasets publicos.")
