from __future__ import annotations

from typing import Any


class WorkerRepository:
    collection_name = "workers"

    def __init__(self, database: Any) -> None:
        self.database = database

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        return await self.database.insert_one(self.collection_name, document)

    async def get_by_worker_id(self, worker_id: str) -> dict[str, Any] | None:
        return await self.database.find_one(self.collection_name, {"worker_id": worker_id})

    async def count(self) -> int:
        return await self.database.count_documents(self.collection_name)
