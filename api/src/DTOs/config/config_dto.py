from typing import List
from pydantic import BaseModel


class TubeRouteDTO(BaseModel):
    origin: str
    originNaPTANOrATCO: str
    destination: str
    destinationNaPTANOrATCO: str
    importance: int = 1


class RailDepartureDTO(BaseModel):
    origin: str
    originCode: str
    destination: str
    destinationCode: str
    importance: int = 1


class TubeDepartureDTO(BaseModel):
    stationName: str
    stationId: str
    importance: int = 1


class TflLineStatusDTO(BaseModel):
    enabled: bool = False
    importance: int = 1


class ConfigDTO(BaseModel):
    tfl_best_routes: List[TubeRouteDTO] = []
    rail_departures: List[RailDepartureDTO] = []
    tube_departures: List[TubeDepartureDTO] = []
    tfl_line_status: TflLineStatusDTO = TflLineStatusDTO()
    refresh_timer: int = 300
