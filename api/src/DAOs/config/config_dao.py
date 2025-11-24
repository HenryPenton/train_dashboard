from typing import List
from pydantic import BaseModel


class TubeRoute(BaseModel):
    origin: str
    originNaPTANOrATCO: str
    destination: str
    destinationNaPTANOrATCO: str
    col_2_position: int = 1
    col_3_position: int = 1
    importance: int = 1


class RailDeparture(BaseModel):
    origin: str
    originCode: str
    destination: str
    destinationCode: str
    col_2_position: int = 1
    col_3_position: int = 1
    importance: int = 1


class TubeDeparture(BaseModel):
    stationName: str
    stationId: str
    col_2_position: int = 1
    col_3_position: int = 1
    importance: int = 1


class TflLineStatus(BaseModel):
    enabled: bool = False
    col_2_position: int = 1
    col_3_position: int = 1
    importance: int = 1


class ConfigDAO(BaseModel):
    tfl_best_routes: List[TubeRoute] = []
    rail_departures: List[RailDeparture] = []
    tube_departures: List[TubeDeparture] = []
    tfl_line_status: TflLineStatus = TflLineStatus()
    refresh_timer: int = 300
