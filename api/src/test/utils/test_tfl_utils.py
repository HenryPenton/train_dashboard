from src.utils.tfl_utils import simplify_tfl_line_status


def test_simplify_tfl_line_status_basic():
    response_json = [
        {
            "name": "Victoria",
            "lineStatuses": [{"statusSeverityDescription": "Good Service"}],
        },
        {
            "name": "Central",
            "lineStatuses": [{"statusSeverityDescription": "Minor Delays"}],
        },
        {
            "name": "Northern",
            "lineStatuses": [
                {"statusSeverityDescription": "Minor Delays"},
                {"statusSeverityDescription": "Part Suspended"}
            ],
        },
        {
            "name": "Mildmay",
            "lineStatuses": [
                {"statusSeverityDescription": "Part Closure"},
                {"statusSeverityDescription": "Part Closure"},
                {"statusSeverityDescription": "Good Service"}
            ],
        },
        {"name": "Jubilee", "lineStatuses": []},
    ]
    result = simplify_tfl_line_status(response_json)
    assert result == [
        {"name": "Victoria", "status": "Good Service"},
        {"name": "Central", "status": "Minor Delays"},
        {"name": "Northern", "status": "Minor Delays, Part Suspended"},
        {"name": "Mildmay", "status": "Part Closure x2, Good Service"},
    ]


def test_simplify_tfl_line_status_empty():
    assert simplify_tfl_line_status([]) == []


def test_simplify_tfl_line_status_missing_fields_omitted():
    response_json = [{}, {"name": "Piccadilly"}]
    result = simplify_tfl_line_status(response_json)
    assert result == []
