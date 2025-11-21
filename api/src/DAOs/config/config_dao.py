from typing import List
from pydantic import BaseModel


class TubeRoute(BaseModel):
    origin: str
    originNaPTANOrATCO: str
    destination: str
    destinationNaPTANOrATCO: str
    importance: int = 1  # User-defined priority (1=highest, higher numbers=lower priority)


class RailDeparture(BaseModel):
    origin: str
    originCode: str
    destination: str
    destinationCode: str
    importance: int = 1  # User-defined priority (1=highest, higher numbers=lower priority)


class TubeDeparture(BaseModel):
    stationName: str
    stationId: str
    importance: int = 1  # User-defined priority (1=highest, higher numbers=lower priority)


class ConfigDAO(BaseModel):
    tfl_best_routes: List[TubeRoute] = []
    rail_departures: List[RailDeparture] = []
    tube_departures: List[TubeDeparture] = []
    show_tfl_lines: bool = False
    refresh_timer: int = 300
