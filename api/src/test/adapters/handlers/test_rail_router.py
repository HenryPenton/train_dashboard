from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.adapters.handlers import rail_handlers_router as rail_handler


class DummyRailService:
    async def get_departures(self, origin, destination):
        class DummyRailAggregate:
            def as_dict(self):
                return {
                    "delay": 5,
                    "status": "Late",
                    "actual": "10:05",
                    "origin": "AAA",
                    "destination": "BBB",
                    "platform": "1",
                    "url": "https://www.realtimetrains.co.uk/service/gb-nr:12345/2024-06-01",
                }

        return [DummyRailAggregate()]


def test_get_departures(monkeypatch):
    monkeypatch.setattr(rail_handler, "rail_service", DummyRailService())
    app = FastAPI()
    app.include_router(rail_handler.router)
    client = TestClient(app)

    response = client.get("/rail/departures/AAA/to/BBB")
    assert response.status_code == 200
    assert response.json() == [
        {
            "actual": "10:05",
            "origin": "AAA",
            "destination": "BBB",
            "platform": "1",
            "status": "Late",
            "delay": 5,
            "url": "https://www.realtimetrains.co.uk/service/gb-nr:12345/2024-06-01",
        }
    ]


def test_get_departures_error(monkeypatch):
    class FailingRailService:
        async def get_departures(self, origin, destination):
            raise Exception("fail")

    monkeypatch.setattr(rail_handler, "rail_service", FailingRailService())
    app = FastAPI()
    app.include_router(rail_handler.router)
    client = TestClient(app)
    response = client.get("/rail/departures/AAA/to/BBB")
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]
