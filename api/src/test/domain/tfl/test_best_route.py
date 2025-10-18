from src.domain.tfl.best_route import BestRoute


class TestBestRoute:
    def test_basic_journey(self):
        best = {
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
        }
        result = BestRoute(best).as_dict()
        assert result == {
            "duration": 45,
            "arrival": "2025-10-17T09:45:00",
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
        best = {
            "duration": 60,
            "arrivalDateTime": "2025-10-17T10:00:00",
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
        result = BestRoute(best).as_dict()
        assert result == {
            "duration": 60,
            "arrival": "2025-10-17T10:00:00",
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

    def test_missing_fields(self):
        best = {
            "duration": None,
            "arrivalDateTime": None,
            "legs": [
                {
                    "mode": {},
                    "instruction": {},
                    "departurePoint": {},
                    "arrivalPoint": {},
                    "routeOptions": [{}],
                }
            ],
        }
        result = BestRoute(best).as_dict()
        assert result == {
            "duration": None,
            "arrival": None,
            "legs": [
                {
                    "mode": None,
                    "instruction": None,
                    "departure": None,
                    "arrival": None,
                    "line": None,
                }
            ],
        }

    def test_multiple_modes(self):
        best = {
            "duration": 30,
            "arrivalDateTime": "2025-10-17T08:30:00",
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
        result = BestRoute(best).as_dict()
        assert result == {
            "duration": 30,
            "arrival": "2025-10-17T08:30:00",
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
