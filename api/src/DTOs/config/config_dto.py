from typing import List
from pydantic import BaseModel


class TubeRouteDTO(BaseModel):
    origin: str
    originNaPTANOrATCO: str
    destination: str
    destinationNaPTANOrATCO: str
    importance: int = 1  # User-defined priority (1=highest, higher numbers=lower priority)


class RailDepartureDTO(BaseModel):
    origin: str
    originCode: str
    destination: str
    destinationCode: str
    importance: int = 1  # User-defined priority (1=highest, higher numbers=lower priority)


class TubeDepartureDTO(BaseModel):
    stationName: str
    stationId: str
    importance: int = 1  # User-defined priority (1=highest, higher numbers=lower priority)


class ConfigDTO(BaseModel):
    tfl_best_routes: List[TubeRouteDTO] = []
    rail_departures: List[RailDepartureDTO] = []
    tube_departures: List[TubeDepartureDTO] = []
    show_tfl_lines: bool = False
    refresh_timer: int = 300
