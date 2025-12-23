from typing import List, Optional
from pydantic import BaseModel


class StatusItemDTO(BaseModel):
    status: str
    reason: Optional[str] = None


class LineDTO(BaseModel):
    name: str
    statuses: List[StatusItemDTO]
    statusSeverity: int
