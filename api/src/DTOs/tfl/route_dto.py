from typing import List, Optional

from pydantic import BaseModel


class RouteLegDTO(BaseModel):
    mode: str
    instruction: str
    departure: str
    arrival: str
    line: str


class RouteDTO(BaseModel):
    duration: int
    arrival: str
    legs: List[RouteLegDTO]
    fare: Optional[int]
