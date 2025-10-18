from src.domain.tfl_utils import simplify_tfl_line_status, summarise_best_route


class TestSimplifyTflLineStatus:
    def test_one_status(self):
        response_json = [
            {
                "name": "Victoria",
                "lineStatuses": [{"statusSeverityDescription": "Good Service"}],
            },
        ]
        result = simplify_tfl_line_status(response_json)
        assert result == [
            {"name": "Victoria", "status": "Good Service"},
        ]

    def test_two_statuses(self):
        response_json = [
            {
                "name": "Northern",
                "lineStatuses": [
                    {"statusSeverityDescription": "Minor Delays"},
                    {"statusSeverityDescription": "Part Suspended"},
                ],
            },
        ]
        result = simplify_tfl_line_status(response_json)
        assert result == [
            {"name": "Northern", "status": "Minor Delays, Part Suspended"},
        ]

    def test_two_same_statuses(self):
        response_json = [
            {
                "name": "Mildmay",
                "lineStatuses": [
                    {"statusSeverityDescription": "Part Closure"},
                    {"statusSeverityDescription": "Part Closure"},
                    {"statusSeverityDescription": "Good Service"},
                ],
            },
        ]
        result = simplify_tfl_line_status(response_json)
        assert result == [
            {"name": "Mildmay", "status": "Part Closure x2, Good Service"},
        ]

    def test_empty(self):
        assert simplify_tfl_line_status([]) == []

    def test_missing_fields_omitted(self):
        response_json = [{}, {"name": "Piccadilly"}]
        result = simplify_tfl_line_status(response_json)
        assert result == []


class TestSummariseBestRoute:
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
        result = summarise_best_route(best)
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
        result = summarise_best_route(best)
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
        result = summarise_best_route(best)
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
        result = summarise_best_route(best)
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
