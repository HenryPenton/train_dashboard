from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.adapters.routers import tfl_handlers_router as tfl_handler


class DummyTFLService:
    async def get_best_route(self, from_station, to_station):
        class DummyRoute:
            def as_dict(self):
                return {
                    "legs": [
                        {
                            "mode": "tube",
                            "instruction": "Take the Central Line",
                            "departure": "Oxford Circus",
                            "arrival": "Liverpool Street",
                            "line": "Central",
                        }
                    ],
                    "duration": 15,
                    "arrival": "2025-10-22T10:00:00Z",
                    "fare": 300,
                }

        return DummyRoute()

    async def get_line_statuses(self):
        class DummyLineStatus:
            def as_dict(self):
                return {
                    "name": "Central",
                    "status": "Good Service",
                    "statusSeverity": 10,
                }

        return [DummyLineStatus()]


def test_get_best_route():
    app = FastAPI()
    app.dependency_overrides[tfl_handler.get_tfl_service] = lambda: DummyTFLService()
    app.include_router(tfl_handler.router)
    client = TestClient(app)

    response = client.get("/tfl/best-route/A/B")
    assert response.status_code == 200
    assert response.json() == {
        "arrival": "2025-10-22T10:00:00Z",
        "duration": 15,
        "fare": 300,
        "legs": [
            {
                "arrival": "Liverpool Street",
                "departure": "Oxford Circus",
                "instruction": "Take the Central Line",
                "line": "Central",
                "mode": "tube",
            },
        ],
    }


def test_get_line_status():
    app = FastAPI()
    app.dependency_overrides[tfl_handler.get_tfl_service] = lambda: DummyTFLService()
    app.include_router(tfl_handler.router)
    client = TestClient(app)

    response = client.get("/tfl/line-status")
    assert response.status_code == 200
    assert response.json() == [
        {"name": "Central", "status": "Good Service", "statusSeverity": 10}
    ]


def test_get_best_route_error():
    class FailingTFLService:
        async def get_best_route(self, from_station, to_station):
            raise Exception("fail")

        async def get_line_statuses(self):
            return []

    app = FastAPI()
    app.dependency_overrides[tfl_handler.get_tfl_service] = lambda: FailingTFLService()
    app.include_router(tfl_handler.router)
    client = TestClient(app)
    response = client.get("/tfl/best-route/A/B")
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]


def test_get_line_status_error():
    class FailingTFLService:
        async def get_best_route(self, from_station, to_station):
            return {}

        async def get_line_statuses(self):
            raise Exception("fail")

    app = FastAPI()
    app.dependency_overrides[tfl_handler.get_tfl_service] = lambda: FailingTFLService()
    app.include_router(tfl_handler.router)
    client = TestClient(app)
    response = client.get("/tfl/line-status")
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]
