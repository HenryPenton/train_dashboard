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


class TubeDepartureDTO(BaseModel):
    stationName: str
    stationId: str


class ConfigDTO(BaseModel):
    tfl_best_routes: List[TubeRouteDTO] = []
    rail_departures: List[RailDepartureDTO] = []
    tube_departures: List[TubeDepartureDTO] = []
    show_tfl_lines: bool = False
    refresh_timer: int = 300
