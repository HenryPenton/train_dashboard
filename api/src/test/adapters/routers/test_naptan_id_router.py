from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.adapters.routers import naptan_id_router as naptan_id_handler


class DummyStation:
    def __init__(self, naptanID, CommonName):
        self.naptanID = naptanID
        self.CommonName = CommonName


class DummyStationService:
    def get_stations(self):
        return [
            DummyStation("id1", "Alpha"),
            DummyStation("id2", "Beta"),
        ]


def test_get_naptan_ids(monkeypatch):
    # Patch the station_service in the handler
    monkeypatch.setattr(naptan_id_handler, "station_service", DummyStationService())
    app = FastAPI()
    app.include_router(naptan_id_handler.router)
    client = TestClient(app)

    response = client.get("/naptan-id")
    assert response.status_code == 200
    assert response.json() == [
        {"naptanID": "id1", "CommonName": "Alpha"},
        {"naptanID": "id2", "CommonName": "Beta"},
    ]


def test_get_naptan_ids_error(monkeypatch):
    class FailingStationService:
        def get_stations(self):
            raise Exception("fail")

    monkeypatch.setattr(naptan_id_handler, "station_service", FailingStationService())
    app = FastAPI()
    app.include_router(naptan_id_handler.router)
    client = TestClient(app)
    response = client.get("/naptan-id")
    assert response.status_code == 500
    assert "detail" in response.json()
    assert "fail" in response.json()["detail"]
