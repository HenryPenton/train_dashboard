from typing import List
from pydantic import BaseModel


class TubeRouteDTO(BaseModel):
    origin: str
    originNaPTANOrATCO: str
    destination: str
    destinationNaPTANOrATCO: str
    col_2_position: int = 1
    col_3_position: int = 1


class RailDepartureDTO(BaseModel):
    origin: str
    originCode: str
    destination: str
    destinationCode: str
    col_2_position: int = 1
    col_3_position: int = 1


class TubeDepartureDTO(BaseModel):
    stationName: str
    stationId: str
    col_2_position: int = 1
    col_3_position: int = 1


class TflLineStatusDTO(BaseModel):
    enabled: bool = False
    col_2_position: int = 1
    col_3_position: int = 1


class ConfigDTO(BaseModel):
    tfl_best_routes: List[TubeRouteDTO] = []
    rail_departures: List[RailDepartureDTO] = []
    tube_departures: List[TubeDepartureDTO] = []
    tfl_line_status: TflLineStatusDTO = TflLineStatusDTO()
    refresh_timer: int = 300
