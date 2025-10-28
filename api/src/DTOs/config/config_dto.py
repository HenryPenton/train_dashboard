from typing import List
from pydantic import BaseModel


class TubeRouteDTO(BaseModel):
    origin: str
    originNaPTANOrATCO: str
    destination: str
    destinationNaPTANOrATCO: str


class RailDepartureDTO(BaseModel):
    origin: str
    originCode: str
    destination: str
    destinationCode: str


class ConfigDTO(BaseModel):
    tfl_best_routes: List[TubeRouteDTO] = []
    rail_departures: List[RailDepartureDTO] = []
    show_tfl_lines: bool = False
    refresh_timer: int = 300
