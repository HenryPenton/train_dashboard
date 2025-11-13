from pydantic import BaseModel
from typing import Optional, Dict, List


class ArrivalDTO(BaseModel):
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


class LineArrivalsDTO(BaseModel):
    lineName: str
    arrivals: Dict[str, List[ArrivalDTO]]


class StationArrivalsDTO(BaseModel):
    lines: Dict[str, LineArrivalsDTO]
