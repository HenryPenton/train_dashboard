from src.domain.tfl.line_status import LineStatus


class TestLineStatus:
    def test_one_status(self):
        response_json = [
            {
                "name": "Victoria",
                "lineStatuses": [{"statusSeverityDescription": "Good Service"}],
            },
        ]
        result = LineStatus(response_json).as_list()
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
        result = LineStatus(response_json).as_list()
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
        result = LineStatus(response_json).as_list()
        assert result == [
            {"name": "Mildmay", "status": "Part Closure x2, Good Service"},
        ]

    def test_empty(self):
        assert LineStatus([]).as_list() == []

    def test_missing_fields_omitted(self):
        response_json = [{}, {"name": "Piccadilly"}]
        result = LineStatus(response_json).as_list()
        assert result == []
