from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.adapters.handlers import tfl_handlers_router as tfl_handler


class DummyTFLService:
    async def get_best_route(self, from_station, to_station):
        return {"route": [from_station, "X", to_station]}

    async def get_line_status(self):
        return [{"line": "Central", "status": "Good Service"}]


def test_get_best_route(monkeypatch):
    monkeypatch.setattr(tfl_handler, "tfl_service", DummyTFLService())
    app = FastAPI()
    app.include_router(tfl_handler.router)
    client = TestClient(app)

    response = client.get("/tfl/best-route/A/B")
    assert response.status_code == 200
    assert response.json() == {"route": ["A", "X", "B"]}


def test_get_line_status(monkeypatch):
    monkeypatch.setattr(tfl_handler, "tfl_service", DummyTFLService())
    app = FastAPI()
    app.include_router(tfl_handler.router)
    client = TestClient(app)

    response = client.get("/tfl/line-status")
    assert response.status_code == 200
    assert response.json() == [{"line": "Central", "status": "Good Service"}]


def test_get_best_route_error(monkeypatch):
    class FailingTFLService:
        async def get_best_route(self, from_station, to_station):
            raise Exception("fail")

        async def get_line_status(self):
            return []

    monkeypatch.setattr(tfl_handler, "tfl_service", FailingTFLService())
    app = FastAPI()
    app.include_router(tfl_handler.router)
    client = TestClient(app)
    response = client.get("/tfl/best-route/A/B")
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]


def test_get_line_status_error(monkeypatch):
    class FailingTFLService:
        async def get_best_route(self, from_station, to_station):
            return {}

        async def get_line_status(self):
            raise Exception("fail")

    monkeypatch.setattr(tfl_handler, "tfl_service", FailingTFLService())
    app = FastAPI()
    app.include_router(tfl_handler.router)
    client = TestClient(app)
    response = client.get("/tfl/line-status")
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]
