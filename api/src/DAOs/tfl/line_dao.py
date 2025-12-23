from typing import List, Optional
from pydantic import BaseModel


class LineStatusDAO(BaseModel):
    statusSeverity: int
    statusSeverityDescription: str
    reason: Optional[str] = None


class LineDAO(BaseModel):
    name: str
    lineStatuses: List[LineStatusDAO]

    @property
    def line_statuses(self) -> List[LineStatusDAO]:
        return self.lineStatuses
