from pydantic import BaseModel
from typing import Optional


class ArrivalDAO(BaseModel):
    id: str
    lineId: str
    lineName: str
    platformName: str
    timeToStation: int
    expectedArrival: str
    towards: str
    currentLocation: Optional[str] = None
    destinationName: Optional[str] = None
    direction: Optional[str] = None
