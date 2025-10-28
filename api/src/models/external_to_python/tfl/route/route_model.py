from typing import List, Optional

from pydantic import BaseModel


class ModeModel(BaseModel):
    name: str


class InstructionModel(BaseModel):
    summary: str


class PointModel(BaseModel):
    commonName: str


class RouteOptionModel(BaseModel):
    name: str


class LegModel(BaseModel):
    mode: ModeModel
    instruction: InstructionModel
    departurePoint: PointModel
    arrivalPoint: PointModel
    routeOptions: List[RouteOptionModel]


class FareModel(BaseModel):
    totalCost: Optional[int] = None


class JourneyModel(BaseModel):
    legs: List[LegModel] = []
    duration: int
    arrivalDateTime: str
    fare: Optional[FareModel] = None

    @property
    def arrival(self) -> str:
        return self.arrivalDateTime

    @property
    def fare_total_cost(self) -> Optional[int]:
        if self.fare is not None:
            return self.fare.totalCost
        return None
