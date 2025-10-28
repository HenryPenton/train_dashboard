from typing import List, Optional

from pydantic import BaseModel


class ModeDAO(BaseModel):
    name: str


class InstructionDAO(BaseModel):
    summary: str


class PointDAO(BaseModel):
    commonName: str


class RouteOptionDAO(BaseModel):
    name: str


class LegDAO(BaseModel):
    mode: ModeDAO
    instruction: InstructionDAO
    departurePoint: PointDAO
    arrivalPoint: PointDAO
    routeOptions: List[RouteOptionDAO]


class FareDAO(BaseModel):
    totalCost: Optional[int] = None


class JourneyDAO(BaseModel):
    legs: List[LegDAO] = []
    duration: int
    arrivalDateTime: str
    fare: Optional[FareDAO] = None

    @property
    def arrival(self) -> str:
        return self.arrivalDateTime

    @property
    def fare_total_cost(self) -> Optional[int]:
        if self.fare is not None:
            return self.fare.totalCost
        return None
