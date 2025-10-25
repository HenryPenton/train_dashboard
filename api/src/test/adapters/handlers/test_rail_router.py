from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.adapters.handlers import rail_handlers_router as rail_handler


class DummyRailService:
    async def get_departures(self, origin, destination):
        return [
            {
                "scheduled": "10:00",
                "actual": "10:05",
                "origin": 'AAA',
                "destination": 'BBB',
            }
        ]


def test_get_departures(monkeypatch):
    monkeypatch.setattr(rail_handler, "rail_service", DummyRailService())
    app = FastAPI()
    app.include_router(rail_handler.router)
    client = TestClient(app)

    response = client.get("/rail/departures/AAA/to/BBB")
    assert response.status_code == 200
    assert response.json() == [
        {"scheduled": "10:00", "actual": "10:05", "origin": "AAA", "destination": "BBB"}
    ]
