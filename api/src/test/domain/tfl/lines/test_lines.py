from src.domain.tfl.lines.lines import LineStatus, LineStatuses
from src.adapters.clients.tflclient import LineRecord


class TestLineStatus:
    def test_one_status(self):
        line = LineRecord({
            "name": "Victoria",
            "lineStatuses": [{"statusSeverityDescription": "Good Service", "statusSeverity": 10}],
        })
        result = LineStatus(line).get_status()
        assert result == {
            "name": "Victoria",
            "status": "Good Service",
            "statusSeverity": 10,
        }

    def test_two_statuses(self):
        line = LineRecord({
            "name": "Northern",
            "lineStatuses": [
                {"statusSeverityDescription": "Minor Delays", "statusSeverity": 6},
                {"statusSeverityDescription": "Part Suspended", "statusSeverity": 4},
            ],
        })
        result = LineStatus(line).get_status()
        assert result == {
            "name": "Northern",
            "status": "Minor Delays, Part Suspended",
            "statusSeverity": 4,
        }

    def test_two_same_statuses(self):
        line = LineRecord({
            "name": "Mildmay",
            "lineStatuses": [
                {"statusSeverityDescription": "Part Closure", "statusSeverity": 3},
                {"statusSeverityDescription": "Part Closure", "statusSeverity": 3},
                {"statusSeverityDescription": "Good Service", "statusSeverity": 10},
            ],
        })
        result = LineStatus(line).get_status()
        assert result == {
            "name": "Mildmay",
            "status": "Part Closure x2, Good Service",
            "statusSeverity": 3,
        }

    def test_empty(self):
        assert LineStatus(LineRecord({})).get_status() is None


class TestLineStatuses:
    def test_empty(self):
        assert LineStatuses([]).get_line_statuses() == []

    def test_one_line(self):
        lines = [
            LineRecord({
                "name": "Victoria",
                "lineStatuses": [{"statusSeverityDescription": "Good Service", "statusSeverity": 10}],
            })
        ]
        result = LineStatuses(lines).get_line_statuses()
        assert result == [
            {
                "name": "Victoria",
                "status": "Good Service",
                "statusSeverity": 10,
            }
        ]

    def test_two_lines(self):
        lines = [
            LineRecord({
                "name": "Northern",
                "lineStatuses": [
                    {"statusSeverityDescription": "Minor Delays", "statusSeverity": 6},
                    {"statusSeverityDescription": "Part Suspended", "statusSeverity": 4},
                ],
            }),
            LineRecord({
                "name": "Piccadilly",
                "lineStatuses": [
                    {"statusSeverityDescription": "Good Service", "statusSeverity": 10},
                ],
            }),
        ]
        result = LineStatuses(lines).get_line_statuses()
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
        lines = [
            LineRecord({}),
            LineRecord({"name": "Piccadilly"}),
            LineRecord({"lineStatuses": []}),
            LineRecord({"lineStatuses": [{"statusSeverityDescription": "Good Service"}]}),
            LineRecord({"name": "Piccadilly", "lineStatuses": [{"statusSeverityDescription": "Good Service"}]}),
        ]
        result = LineStatuses(lines).get_line_statuses()
        assert result == []
