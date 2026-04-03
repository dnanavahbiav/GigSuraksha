from __future__ import annotations

from typing import Any


class ClaimRepository:
    collection_name = "claims"

    def __init__(self, database: Any) -> None:
        self.database = database

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        return await self.database.insert_one(self.collection_name, document)

    async def get_by_claim_id(self, claim_id: str) -> dict[str, Any] | None:
        return await self.database.find_one(self.collection_name, {"claim_id": claim_id})

    async def list_by_worker(self, worker_id: str) -> list[dict[str, Any]]:
        return await self.database.find_many(
            self.collection_name,
            {"worker_id": worker_id},
            sort=("created_at", -1),
        )

    async def list_all(self, status: str | None = None, limit: int | None = None) -> list[dict[str, Any]]:
        filters = {"status": status} if status else None
        return await self.database.find_many(
            self.collection_name,
            filters=filters,
            sort=("created_at", -1),
            limit=limit,
        )

    async def get_duplicate(
        self,
        worker_id: str,
        policy_id: str,
        event_id: str,
    ) -> dict[str, Any] | None:
        return await self.database.find_one(
            self.collection_name,
            {
                "worker_id": worker_id,
                "policy_id": policy_id,
                "event_id": event_id,
            },
        )

    async def count(self) -> int:
        return await self.database.count_documents(self.collection_name)
