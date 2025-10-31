from typing import List, Union
from pydantic import BaseModel

class ScheduleBaseDTO(BaseModel):
    type: str
    day_of_week: str
    time: str
    topic: str

class BestRouteScheduleDTO(ScheduleBaseDTO):
    type: str = "best_route"
    from_code: str
    to_code: str
    from_name: str
    to_name: str

class RailScheduleDTO(ScheduleBaseDTO):
    type: str = "rail_departure"
    from_station_code: str
    to_station_code: str
    from_station_name: str
    to_station_name: str

class TubeLineStatusScheduleDTO(ScheduleBaseDTO):
    type: str = "tube_line_status"

class SchedulesDTO(BaseModel):
    schedules: List[Union[BestRouteScheduleDTO, RailScheduleDTO, TubeLineStatusScheduleDTO]]
