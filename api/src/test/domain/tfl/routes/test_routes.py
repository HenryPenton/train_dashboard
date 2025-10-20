from src.domain.tfl.routes.routes import AllRoutes
from src.adapters.clients.tflclient import JourneyRecord


class TestAllRoutes:
    def test_get_best_with_journeys(self):
        journeys = [
            JourneyRecord(
                {
                    "duration": 25,
                    "arrivalDateTime": "2025-10-19T10:30:00Z",
                    "legs": [
                        {
                            "mode": {"name": "tube"},
                            "instruction": {"summary": "Take the Northern line"},
                            "departurePoint": {"commonName": "ABC"},
                            "arrivalPoint": {"commonName": "XYZ"},
                            "routeOptions": [{"name": "Northern"}],
                        }
                    ],
                }
            )
        ]
        all_routes = AllRoutes(journeys)
        result = all_routes.get_best()
        assert result["duration"] == 25
        assert result["arrival"] == "2025-10-19T10:30:00Z"
        assert isinstance(result["legs"], list)
        assert result["legs"][0]["mode"] == "tube"
        assert result["legs"][0]["instruction"] == "Take the Northern line"
        assert result["legs"][0]["departure"] == "ABC"
        assert result["legs"][0]["arrival"] == "XYZ"
        assert result["legs"][0]["line"] == "Northern"

    def test_get_best_with_no_journeys(self):
        all_routes = AllRoutes([])
        result = all_routes.get_best()
        assert result == {"error": "No journeys found"}

    def test_get_best_with_empty_journeys(self):
        all_routes = AllRoutes([])
        result = all_routes.get_best()
        assert result == {"error": "No journeys found"}

    def test_get_best_picks_first_journey(self):
        journeys = [
            JourneyRecord(
                {
                    "duration": 10,
                    "arrivalDateTime": "2025-10-19T09:00:00Z",
                    "legs": [
                        {
                            "mode": {"name": "tube"},
                            "instruction": {"summary": "Take the Victoria line"},
                            "departurePoint": {"commonName": "Brixton"},
                            "arrivalPoint": {"commonName": "Oxford Circus"},
                            "routeOptions": [{"name": "Victoria"}],
                        }
                    ],
                }
            ),
            JourneyRecord(
                {
                    "duration": 25,
                    "arrivalDateTime": "2025-10-19T10:30:00Z",
                    "legs": [
                        {
                            "mode": {"name": "tube"},
                            "instruction": {"summary": "Take the Northern line"},
                            "departurePoint": {"commonName": "ABC"},
                            "arrivalPoint": {"commonName": "XYZ"},
                            "routeOptions": [{"name": "Northern"}],
                        }
                    ],
                }
            ),
        ]
        all_routes = AllRoutes(journeys)
        result = all_routes.get_best()
        assert result["duration"] == 10
        assert result["arrival"] == "2025-10-19T09:00:00Z"
        assert result["legs"][0]["instruction"] == "Take the Victoria line"
