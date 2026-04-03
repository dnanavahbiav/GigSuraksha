from __future__ import annotations

import copy
import uuid
from collections import defaultdict
from typing import Any, Iterable

from app.config import get_settings

try:
    from motor.motor_asyncio import AsyncIOMotorClient
except ImportError:  # pragma: no cover - optional in local test mode
    AsyncIOMotorClient = None


def _matches_filters(document: dict[str, Any], filters: dict[str, Any] | None) -> bool:
    if not filters:
        return True
    for key, expected_value in filters.items():
        if document.get(key) != expected_value:
            return False
    return True


def _sort_documents(
    documents: Iterable[dict[str, Any]],
    sort: tuple[str, int] | None,
) -> list[dict[str, Any]]:
    sorted_documents = list(documents)
    if sort is None:
        return sorted_documents
    field_name, direction = sort
    reverse = direction < 0
    sorted_documents.sort(key=lambda item: item.get(field_name), reverse=reverse)
    return sorted_documents


def _normalize_document(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if document is None:
        return None
    normalized = copy.deepcopy(document)
    internal_id = normalized.get("_id")
    if internal_id is not None:
        normalized["_id"] = str(internal_id)
    return normalized


class InMemoryDatabase:
    def __init__(self) -> None:
        self._collections: dict[str, list[dict[str, Any]]] = defaultdict(list)

    async def ping(self) -> bool:
        return True

    async def insert_one(self, collection: str, document: dict[str, Any]) -> dict[str, Any]:
        stored = copy.deepcopy(document)
        stored.setdefault("_id", str(uuid.uuid4()))
        self._collections[collection].append(stored)
        return _normalize_document(stored) or {}

    async def find_one(
        self,
        collection: str,
        filters: dict[str, Any] | None = None,
    ) -> dict[str, Any] | None:
        for document in self._collections[collection]:
            if _matches_filters(document, filters):
                return _normalize_document(document)
        return None

    async def find_many(
        self,
        collection: str,
        filters: dict[str, Any] | None = None,
        sort: tuple[str, int] | None = None,
        limit: int | None = None,
    ) -> list[dict[str, Any]]:
        documents = [
            _normalize_document(document) or {}
            for document in self._collections[collection]
            if _matches_filters(document, filters)
        ]
        documents = _sort_documents(documents, sort)
        if limit is not None:
            documents = documents[:limit]
        return documents

    async def count_documents(
        self,
        collection: str,
        filters: dict[str, Any] | None = None,
    ) -> int:
        return len(
            [document for document in self._collections[collection] if _matches_filters(document, filters)]
        )

    async def close(self) -> None:
        return None


class MongoDatabase:
    def __init__(self, uri: str, database_name: str) -> None:
        if AsyncIOMotorClient is None:
            raise RuntimeError("motor is not installed.")
        self._client = AsyncIOMotorClient(uri)
        self._database = self._client[database_name]

    async def ping(self) -> bool:
        await self._database.command("ping")
        return True

    async def insert_one(self, collection: str, document: dict[str, Any]) -> dict[str, Any]:
        payload = copy.deepcopy(document)
        result = await self._database[collection].insert_one(payload)
        payload["_id"] = result.inserted_id
        return _normalize_document(payload) or {}

    async def find_one(
        self,
        collection: str,
        filters: dict[str, Any] | None = None,
    ) -> dict[str, Any] | None:
        document = await self._database[collection].find_one(filters or {})
        return _normalize_document(document)

    async def find_many(
        self,
        collection: str,
        filters: dict[str, Any] | None = None,
        sort: tuple[str, int] | None = None,
        limit: int | None = None,
    ) -> list[dict[str, Any]]:
        cursor = self._database[collection].find(filters or {})
        if sort is not None:
            cursor = cursor.sort(sort[0], sort[1])
        if limit is not None:
            cursor = cursor.limit(limit)
        documents = await cursor.to_list(length=limit or 1000)
        return [_normalize_document(document) or {} for document in documents]

    async def count_documents(
        self,
        collection: str,
        filters: dict[str, Any] | None = None,
    ) -> int:
        return int(await self._database[collection].count_documents(filters or {}))

    async def close(self) -> None:
        self._client.close()


async def create_database() -> InMemoryDatabase | MongoDatabase:
    settings = get_settings()
    if settings.use_in_memory_db:
        return InMemoryDatabase()
    database = MongoDatabase(settings.mongodb_uri or "", settings.database_name)
    await database.ping()
    return database
