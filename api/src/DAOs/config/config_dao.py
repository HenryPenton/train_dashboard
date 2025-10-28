from typing import List
from pydantic import BaseModel


class TubeRoute(BaseModel):
    origin: str
    originNaPTANOrATCO: str
    destination: str
    destinationNaPTANOrATCO: str


class RailDeparture(BaseModel):
    origin: str
    originCode: str
    destination: str
    destinationCode: str


class ConfigDAO(BaseModel):
    tfl_best_routes: List[TubeRoute] = []
    rail_departures: List[RailDeparture] = []
    show_tfl_lines: bool = False
    refresh_timer: int = 300
