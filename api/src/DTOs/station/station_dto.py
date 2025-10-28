from pydantic import BaseModel


class StationDTO(BaseModel):
    naptanID: str
    CommonName: str
