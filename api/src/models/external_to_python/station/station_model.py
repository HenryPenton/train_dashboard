from pydantic import BaseModel


class StationModel(BaseModel):
    naptanID: str
    commonName: str
