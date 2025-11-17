from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.adapters.routers.tfl import station_codes_router as station_codes_handler


class DummyReader:
    def read(self):
        return [
            {"naptanID": "id1", "commonName": "Alpha"},
            {"naptanID": "id2", "commonName": "Beta"},
        ]


class DummyStationService:
    def __init__(self, reader, logger):
        self.reader = reader
        self.logger = logger

    def get_stations(self):
        return [
            type('Station', (), {"naptanID": "id1", "commonName": "Alpha"})(),
            type('Station', (), {"naptanID": "id2", "commonName": "Beta"})(),
        ]


def test_get_station_codes():
    app = FastAPI()
    app.include_router(station_codes_handler.router)
    
    def mock_service():
        return DummyStationService(None, None)
    
    app.dependency_overrides[station_codes_handler.get_station_service] = mock_service
    client = TestClient(app)

    response = client.get("/tfl/station-codes")
    assert response.status_code == 200
    assert response.json() == [
        {"naptanID": "id1", "CommonName": "Alpha"},
        {"naptanID": "id2", "CommonName": "Beta"},
    ]


def test_get_station_codes_tube():
    app = FastAPI()
    app.include_router(station_codes_handler.router)
    
    def mock_service():
        return DummyStationService(None, None)
    
    app.dependency_overrides[station_codes_handler.get_station_service] = mock_service
    client = TestClient(app)

    response = client.get("/tfl/station-codes?station_type=tube")
    assert response.status_code == 200
    assert response.json() == [
        {"naptanID": "id1", "CommonName": "Alpha"},
        {"naptanID": "id2", "CommonName": "Beta"},
    ]


def test_get_station_codes_invalid_type():
    app = FastAPI()
    app.include_router(station_codes_handler.router)
    client = TestClient(app)

    response = client.get("/tfl/station-codes?station_type=invalid")
    assert response.status_code == 422


def test_get_station_codes_error():
    class FailingStationService:
        def __init__(self, reader, logger):
            pass
        
        def get_stations(self):
            raise Exception("fail")

    app = FastAPI()
    app.include_router(station_codes_handler.router)
    
    def mock_failing_service():
        return FailingStationService(None, None)
    
    app.dependency_overrides[station_codes_handler.get_station_service] = mock_failing_service
    client = TestClient(app)
    
    response = client.get("/tfl/station-codes")
    assert response.status_code == 500
    assert "detail" in response.json()
    assert "fail" in response.json()["detail"]


def test_get_reader_naptan():
    reader = station_codes_handler.get_reader(station_codes_handler.StationType.naptan)
    assert isinstance(reader, station_codes_handler.JSONFileReader)


def test_get_reader_tube():
    reader = station_codes_handler.get_reader(station_codes_handler.StationType.tube)
    assert isinstance(reader, station_codes_handler.JSONFileReader)


def test_get_station_service():
    reader = DummyReader()
    service = station_codes_handler.get_station_service(reader)
    assert isinstance(service, station_codes_handler.StationService)