from typing import List, Literal

from pydantic import BaseModel


# API Response Models
class RailDeparture(BaseModel):
    origin: str
    destination: str
    status: str
    platform: str
    actual: str
    delay: int


class RouteInstruction(BaseModel):
    mode: str
    instruction: str


class BestRoute(BaseModel):
    duration: int
    arrival: str
    legs: List[RouteInstruction]


class StatusItem(BaseModel):
    status: str
    reason: str | None = None


class TubeLineStatus(BaseModel):
    name: str
    statuses: List[StatusItem]
    statusSeverity: int


class SchedulesResponse(BaseModel):
    schedules: List[dict]  # Keep as dict since we convert to specific schedule models


# Schedule Models
class ScheduleBase(BaseModel):
    day_of_week: str
    time: str
    topic: str


class BestRouteSchedule(ScheduleBase):
    type: Literal["best_route"]
    from_code: str
    to_code: str
    from_name: str
    to_name: str


class RailSchedule(ScheduleBase):
    type: Literal["rail_departure"]
    from_station_code: str
    to_station_code: str
    from_station_name: str
    to_station_name: str


class TubeLineStatusSchedule(ScheduleBase):
    type: Literal["tube_line_status"]
