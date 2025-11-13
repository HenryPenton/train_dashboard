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

    async def get_arrivals_by_line(self, station_id):
        return {
            "lines": {
                "circle": {
                    "lineName": "Circle",
                    "arrivals": {
                        "Platform 1": [
                            {
                                "id": "123",
                                "lineId": "circle",
                                "lineName": "Circle",
                                "platformName": "Platform 1",
                                "timeToStation": 120,
                                "expectedArrival": "2025-11-13T18:12:32Z",
                                "towards": "Edgware Road"
                            }
                        ]
                    }
                }
            }
        }


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

        async def get_arrivals_by_line(self, station_id):
            return {}

    app = FastAPI()
    app.dependency_overrides[tfl_handler.get_tfl_service] = lambda: FailingTFLService()
    app.include_router(tfl_handler.router)
    client = TestClient(app)
    response = client.get("/tfl/line-status")
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]


def test_get_station_arrivals():
    app = FastAPI()
    app.dependency_overrides[tfl_handler.get_tfl_service] = lambda: DummyTFLService()
    app.include_router(tfl_handler.router)
    client = TestClient(app)

    response = client.get("/tfl/arrivals/940GZZLUPAC")
    assert response.status_code == 200
    assert response.json() == {
        "lines": {
            "circle": {
                "lineName": "Circle",
                "arrivals": {
                    "Platform 1": [
                        {
                            "id": "123",
                            "lineId": "circle",
                            "lineName": "Circle",
                            "platformName": "Platform 1",
                            "timeToStation": 120,
                            "expectedArrival": "2025-11-13T18:12:32Z",
                            "towards": "Edgware Road"
                        }
                    ]
                }
            }
        }
    }


def test_get_station_arrivals_error():
    class FailingTFLService:
        async def get_best_route(self, from_station, to_station):
            return {}

        async def get_line_statuses(self):
            return []

        async def get_arrivals_by_line(self, station_id):
            raise Exception("arrivals fail")

    app = FastAPI()
    app.dependency_overrides[tfl_handler.get_tfl_service] = lambda: FailingTFLService()
    app.include_router(tfl_handler.router)
    client = TestClient(app)
    response = client.get("/tfl/arrivals/940GZZLUPAC")
    assert response.status_code == 500
    assert "arrivals fail" in response.json()["detail"]


def test_get_tfl_client():
    client = tfl_handler.get_tfl_client()
    assert isinstance(client, tfl_handler.TFLClient)
    assert client.client is not None


def test_get_tfl_service():
    tfl_client = tfl_handler.get_tfl_client()
    service = tfl_handler.get_tfl_service(tfl_client)
    assert isinstance(service, tfl_handler.TFLService)
    assert service.client == tfl_client
    assert service.logger is not None
