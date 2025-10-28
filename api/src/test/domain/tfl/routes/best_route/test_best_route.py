from src.domain.tfl.routes.routes import BestRoute
from src.models.external_to_python.tfl.route.route_model import JourneyModel


class TestBestRoute:
    def test_basic_journey(self):
        best = JourneyModel(
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
        result = BestRoute(best).get_best_route_summary()
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
        best = JourneyModel(
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
        result = BestRoute(best).get_best_route_summary()
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
        best = JourneyModel(
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
        result = BestRoute(best).get_best_route_summary()
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
