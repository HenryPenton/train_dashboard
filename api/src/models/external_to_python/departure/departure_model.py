from typing import List, Optional

from pydantic import BaseModel


class Location(BaseModel):
    description: str


class DepartureModel(BaseModel):
    origin: List[Location] = []
    destination: List[Location] = []
    gbttBookedDeparture: str
    realtimeDeparture: Optional[str] = None
    platform: Optional[str] = "?"

    @property
    def origins(self) -> List[str]:
        return [o.description for o in self.origin if isinstance(o, Location)]

    @property
    def destinations(self) -> List[str]:
        return [d.description for d in self.destination if isinstance(d, Location)]

    @property
    def scheduled_departure(self) -> str:
        return self.gbttBookedDeparture

    @property
    def real_departure(self) -> Optional[str]:
        return self.realtimeDeparture
