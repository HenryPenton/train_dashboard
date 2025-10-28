from pydantic import BaseModel


class DepartureDTO(BaseModel):
    delay: int
    status: str
    actual: str
    origin: str
    destination: str
    platform: str
