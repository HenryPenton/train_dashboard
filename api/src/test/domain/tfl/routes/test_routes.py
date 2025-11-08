import pytest
from src.DAOs.tfl.route_dao import JourneyDAO
from src.domain.tfl.routes.routes import Route, RoutesList
from src.test.utils.dummy_logger import DummyLogger


class TestRoutes:
    def test_basic_journey(self):
        best = JourneyDAO(
            **{
                "duration": 45,
                "arrivalDateTime": "2025-10-17T09:45:00",
                "legs": [
                    {
                        "mode": {"name": "Tube"},
                        "instruction": {"summary": "Take the Central line"},
                        "departurePoint": {"commonName": "Oxford Circus"},
                        "arrivalPoint": {"commonName": "Liverpool Street"},
                        "routeOptions": [{"name": "Central"}],
                    }
                ],
                "fare": {"totalCost": 250},
            }
        )
        logger = DummyLogger()

        route = Route(best, logger=logger)
        result = route.as_dict()
        assert result == {
            "duration": 45,
            "arrival": "2025-10-17T09:45:00",
            "fare": 250,
            "legs": [
                {
                    "mode": "Tube",
                    "instruction": "Take the Central line",
                    "departure": "Oxford Circus",
                    "arrival": "Liverpool Street",
                    "line": "Central",
                }
            ],
        }

    def test_multiple_legs(self):
        best = JourneyDAO(
            **{
                "duration": 60,
                "arrivalDateTime": "2025-10-17T10:00:00",
                "fare": {"totalCost": 300},
                "legs": [
                    {
                        "mode": {"name": "Tube"},
                        "instruction": {"summary": "Take the Victoria line"},
                        "departurePoint": {"commonName": "Brixton"},
                        "arrivalPoint": {"commonName": "Oxford Circus"},
                        "routeOptions": [{"name": "Victoria"}],
                    },
                    {
                        "mode": {"name": "Tube"},
                        "instruction": {"summary": "Change to Central line"},
                        "departurePoint": {"commonName": "Oxford Circus"},
                        "arrivalPoint": {"commonName": "Liverpool Street"},
                        "routeOptions": [{"name": "Central"}],
                    },
                ],
            }
        )
        logger = DummyLogger()
        route = Route(best, logger=logger)
        result = route.as_dict()
        assert result == {
            "duration": 60,
            "arrival": "2025-10-17T10:00:00",
            "fare": 300,
            "legs": [
                {
                    "mode": "Tube",
                    "instruction": "Take the Victoria line",
                    "departure": "Brixton",
                    "arrival": "Oxford Circus",
                    "line": "Victoria",
                },
                {
                    "mode": "Tube",
                    "instruction": "Change to Central line",
                    "departure": "Oxford Circus",
                    "arrival": "Liverpool Street",
                    "line": "Central",
                },
            ],
        }

    def test_multiple_modes(self):
        best = JourneyDAO(
            **{
                "duration": 30,
                "arrivalDateTime": "2025-10-17T08:30:00",
                "fare": {"totalCost": 150},
                "legs": [
                    {
                        "mode": {"name": "Bus"},
                        "instruction": {"summary": "Take the 25 bus"},
                        "departurePoint": {"commonName": "Stratford"},
                        "arrivalPoint": {"commonName": "Aldgate"},
                        "routeOptions": [{"name": "25"}],
                    },
                    {
                        "mode": {"name": "Tram"},
                        "instruction": {"summary": "Take the Croydon Tramlink"},
                        "departurePoint": {"commonName": "East Croydon"},
                        "arrivalPoint": {"commonName": "Wimbledon"},
                        "routeOptions": [{"name": "Tramlink"}],
                    },
                ],
            }
        )
        logger = DummyLogger()
        route = Route(best, logger=logger)
        result = route.as_dict()
        assert result == {
            "duration": 30,
            "arrival": "2025-10-17T08:30:00",
            "fare": 150,
            "legs": [
                {
                    "mode": "Bus",
                    "instruction": "Take the 25 bus",
                    "departure": "Stratford",
                    "arrival": "Aldgate",
                    "line": "25",
                },
                {
                    "mode": "Tram",
                    "instruction": "Take the Croydon Tramlink",
                    "departure": "East Croydon",
                    "arrival": "Wimbledon",
                    "line": "Tramlink",
                },
            ],
        }

    def test_get_best_with_journeys(self):
        journeys = [
            JourneyDAO(
                **{
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
        logger = DummyLogger()
        all_routes = RoutesList(journeys, logger=logger)
        result = all_routes.get_best_route().as_dict()
        assert result["duration"] == 25
        assert result["arrival"] == "2025-10-19T10:30:00Z"
        assert isinstance(result["legs"], list)
        assert result["legs"][0]["mode"] == "tube"
        assert result["legs"][0]["instruction"] == "Take the Northern line"
        assert result["legs"][0]["departure"] == "ABC"
        assert result["legs"][0]["arrival"] == "XYZ"
        assert result["legs"][0]["line"] == "Northern"

    def test_get_best_with_no_journeys(self):
        logger = DummyLogger()
        all_routes = RoutesList([], logger=logger)
        with pytest.raises(ValueError, match="No routes available"):
            all_routes.get_best_route().as_dict()

    def test_get_best_picks_first_journey(self):
        journeys = [
            JourneyDAO(
                **{
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
            JourneyDAO(
                **{
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
        logger = DummyLogger()
        all_routes = RoutesList(journeys, logger=logger)
        result = all_routes.get_best_route().as_dict()
        assert result["duration"] == 10
        assert result["arrival"] == "2025-10-19T09:00:00Z"
        assert result["legs"][0]["instruction"] == "Take the Victoria line"
