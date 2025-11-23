from typing import List
from pydantic import BaseModel


class LineDTO(BaseModel):
    name: str
    statusList: List[str]
    statusSeverity: int
