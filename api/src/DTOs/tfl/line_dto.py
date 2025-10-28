from pydantic import BaseModel


class LineDTO(BaseModel):
    name: str
    status: str
    statusSeverity: int
