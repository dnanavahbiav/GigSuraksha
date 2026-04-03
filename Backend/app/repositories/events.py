from __future__ import annotations

from typing import Any


class EventRepository:
    collection_name = "events"

    def __init__(self, database: Any) -> None:
        self.database = database

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        return await self.database.insert_one(self.collection_name, document)

    async def get_by_event_id(self, event_id: str) -> dict[str, Any] | None:
        return await self.database.find_one(self.collection_name, {"event_id": event_id})

    async def list_recent(self, limit: int = 5) -> list[dict[str, Any]]:
        return await self.database.find_many(
            self.collection_name,
            sort=("created_at", -1),
            limit=limit,
        )

    async def count(self) -> int:
        return await self.database.count_documents(self.collection_name)
