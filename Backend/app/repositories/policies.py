from __future__ import annotations

from typing import Any


class PolicyRepository:
    collection_name = "policies"

    def __init__(self, database: Any) -> None:
        self.database = database

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        return await self.database.insert_one(self.collection_name, document)

    async def get_by_policy_id(self, policy_id: str) -> dict[str, Any] | None:
        return await self.database.find_one(self.collection_name, {"policy_id": policy_id})

    async def list_by_worker(self, worker_id: str) -> list[dict[str, Any]]:
        return await self.database.find_many(
            self.collection_name,
            {"worker_id": worker_id},
            sort=("created_at", -1),
        )

    async def list_active_by_location(self, city: str, zone: str) -> list[dict[str, Any]]:
        return await self.database.find_many(
            self.collection_name,
            {"city": city, "zone": zone, "status": "active"},
            sort=("created_at", -1),
        )

    async def count_active(self) -> int:
        return await self.database.count_documents(self.collection_name, {"status": "active"})
