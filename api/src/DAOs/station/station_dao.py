from pydantic import BaseModel


class StationDAO(BaseModel):
    naptanID: str
    commonName: str
