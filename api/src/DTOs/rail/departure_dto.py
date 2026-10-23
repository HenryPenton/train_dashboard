from enum import Enum
from typing import Optional

from pydantic import BaseModel


class DepartureStatus(str, Enum):
    ON_TIME = "On time"
    LATE = "Late"
    EARLY = "Early"
    CANCELLED = "Cancelled"


class DepartureDTO(BaseModel):
    url: str
    delay: int
    status: DepartureStatus
    actual: str
    arrival: Optional[str] = None
    origin: str
    destination: str
    platform: str
