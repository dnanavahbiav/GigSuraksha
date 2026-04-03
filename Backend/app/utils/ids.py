from __future__ import annotations

from datetime import datetime, timezone
from secrets import token_hex


def generate_readable_id(prefix: str) -> str:
    timestamp = datetime.now(tz=timezone.utc).strftime("%Y%m%d%H%M%S")
    suffix = token_hex(2)
    return f"{prefix}_{timestamp}_{suffix}"
