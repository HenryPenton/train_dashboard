from typing import List, Optional, Literal

from pydantic import BaseModel, field_validator


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
    displayAs: Optional[
        Literal[
            "CALL",
            "PASS",
            "ORIGIN",
            "DESTINATION",
            "STARTS",
            "TERMINATES",
            "CANCELLED_CALL",
            "CANCELLED_PASS",
        ]
    ] = None
    locations: List[dict] = []  # Service locations from RTT API

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


class DeparturesDAO(BaseModel):
    services: List[dict] = []

    @field_validator("services", mode="before")
    @classmethod
    def handle_none_services(cls, v):
        if v is None:
            return []
        return v
