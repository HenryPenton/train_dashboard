from typing import List, Union

from pydantic import BaseModel


class ScheduleBaseDAO(BaseModel):
    type: str
    day_of_week: str
    time: str


class BestRouteScheduleDAO(ScheduleBaseDAO):
    type: str = "best_route"
    from_code: str
    to_code: str
    from_name: str
    to_name: str


class RailScheduleDAO(ScheduleBaseDAO):
    type: str = "rail_departure"
    from_station_code: str
    to_station_code: str
    from_station_name: str
    to_station_name: str


class TubeLineStatusScheduleDAO(ScheduleBaseDAO):
    type: str = "tube_line_status"


class SchedulesDAO(BaseModel):
    schedules: List[
        Union[BestRouteScheduleDAO, RailScheduleDAO, TubeLineStatusScheduleDAO]
    ] = []
