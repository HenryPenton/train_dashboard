from typing import Literal

from pydantic import BaseModel


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
