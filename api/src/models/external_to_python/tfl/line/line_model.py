from typing import List
from pydantic import BaseModel


class LineStatusModel(BaseModel):
    statusSeverity: int
    statusSeverityDescription: str


class LineModel(BaseModel):
    id: str
    name: str
    lineStatuses: List[LineStatusModel]

    @property
    def line_statuses(self) -> List[LineStatusModel]:
        return self.lineStatuses
