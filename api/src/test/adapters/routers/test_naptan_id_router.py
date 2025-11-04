from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.adapters.routers import naptan_id_router as naptan_id_handler


class DummyStation:
    def __init__(self, naptanID, commonName):
        self.naptanID = naptanID
        self.commonName = commonName


class DummyStationService:
    def get_stations(self):
        return [
            DummyStation("id1", "Alpha"),
            DummyStation("id2", "Beta"),
        ]


def test_get_naptan_ids():
    app = FastAPI()
    app.include_router(naptan_id_handler.router)
    app.dependency_overrides[naptan_id_handler.get_station_service] = (
        lambda: DummyStationService()
    )
    client = TestClient(app)

    response = client.get("/naptan-id")
    assert response.status_code == 200
    assert response.json() == [
        {"naptanID": "id1", "CommonName": "Alpha"},
        {"naptanID": "id2", "CommonName": "Beta"},
    ]


def test_get_naptan_ids_error():
    class FailingStationService:
        def get_stations(self):
            raise Exception("fail")

    app = FastAPI()
    app.include_router(naptan_id_handler.router)
    app.dependency_overrides[naptan_id_handler.get_station_service] = (
        lambda: FailingStationService()
    )
    client = TestClient(app)
    response = client.get("/naptan-id")
    assert response.status_code == 500
    assert "detail" in response.json()
    assert "fail" in response.json()["detail"]
