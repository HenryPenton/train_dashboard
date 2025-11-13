from typing import List, Optional

from pydantic import BaseModel


class Location(BaseModel):
    description: str


class DepartureDAO(BaseModel):
    origin: List[Location] = []
    destination: List[Location] = []
    gbttBookedDeparture: str
    serviceUid: str
    runDate: str
    realtimeDeparture: Optional[str] = None
    platform: Optional[str] = None
    cancelReasonCode: Optional[str] = None

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
