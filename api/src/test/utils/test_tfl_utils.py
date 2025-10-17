from src.utils.tfl_utils import simplify_tfl_line_status


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
                    {"statusSeverityDescription": "Part Suspended"}
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
                    {"statusSeverityDescription": "Good Service"}
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
