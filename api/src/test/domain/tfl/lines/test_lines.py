from src.domain.tfl.lines.lines import LineStatus, LineStatuses


class TestLineStatus:
    def test_one_status(self):
        line = {
            "name": "Victoria",
            "lineStatuses": [{"statusSeverityDescription": "Good Service", "statusSeverity": 10}],
        }

        result = LineStatus(line).get_status()
        assert result == {
            "name": "Victoria",
            "status": "Good Service",
            "statusSeverity": 10,
        }

    def test_two_statuses(self):
        line = {
            "name": "Northern",
            "lineStatuses": [
                {"statusSeverityDescription": "Minor Delays", "statusSeverity": 6},
                {"statusSeverityDescription": "Part Suspended", "statusSeverity": 4},
            ],
        }

        result = LineStatus(line).get_status()

        assert result == {
            "name": "Northern",
            "status": "Minor Delays, Part Suspended",
            "statusSeverity": 4,
        }

    def test_two_same_statuses(self):
        line = {
            "name": "Mildmay",
            "lineStatuses": [
                {"statusSeverityDescription": "Part Closure", "statusSeverity": 3},
                {"statusSeverityDescription": "Part Closure", "statusSeverity": 3},
                {"statusSeverityDescription": "Good Service", "statusSeverity": 10},
            ],
        }

        result = LineStatus(line).get_status()
        assert result == {
            "name": "Mildmay",
            "status": "Part Closure x2, Good Service",
            "statusSeverity": 3,
        }

    def test_empty(self):
        assert LineStatus({}).get_status() is None


class TestLineStatuses:
    def test_empty(self):
        assert LineStatuses([]).get_line_statuses() == []

    def test_one_line(self):
        response_json = [
            {
                "name": "Victoria",
                "lineStatuses": [{"statusSeverityDescription": "Good Service", "statusSeverity": 10}],
            },
        ]
        result = LineStatuses(response_json).get_line_statuses()
        assert result == [
            {
                "name": "Victoria",
                "status": "Good Service",
                "statusSeverity": 10,
            }
        ]

    def test_two_lines(self):
        response_json = [
            {
                "name": "Northern",
                "lineStatuses": [
                    {"statusSeverityDescription": "Minor Delays", "statusSeverity": 6},
                    {"statusSeverityDescription": "Part Suspended", "statusSeverity": 4},
                ],
            },
            {
                "name": "Piccadilly",
                "lineStatuses": [
                    {"statusSeverityDescription": "Good Service", "statusSeverity": 10},
                ],
            },
        ]
        result = LineStatuses(response_json).get_line_statuses()
        assert result == [
            {
                "name": "Northern",
                "status": "Minor Delays, Part Suspended",
                "statusSeverity": 4,
            },
            {
                "name": "Piccadilly",
                "status": "Good Service",
                "statusSeverity": 10,
            },
        ]

    def test_missing_fields_omitted(self):
        response_json = [
            {},
            {"name": "Piccadilly"},
            {"lineStatuses": []},
            {
                "lineStatuses": [{"statusSeverityDescription": "Good Service"}],
            },
            {
                "name": "Piccadilly",
                "lineStatuses": [{"statusSeverityDescription": "Good Service"}],
            },
        ]
        result = LineStatuses(response_json).get_line_statuses()
        assert result == []
