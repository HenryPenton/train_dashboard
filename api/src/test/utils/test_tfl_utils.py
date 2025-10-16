from src.utils.tfl_utils import simplify_tfl_line_status

def test_simplify_tfl_line_status_basic():
    response_json = [
        {
            "name": "Victoria",
            "lineStatuses": [
                {"statusSeverityDescription": "Good Service"}
            ]
        },
        {
            "name": "Central",
            "lineStatuses": [
                {"statusSeverityDescription": "Minor Delays"}
            ]
        },
        {
            "name": "Jubilee",
            "lineStatuses": []
        }
    ]
    result = simplify_tfl_line_status(response_json)
    assert result == [
        {"name": "Victoria", "status": "Good Service"},
        {"name": "Central", "status": "Minor Delays"},
    ]

def test_simplify_tfl_line_status_empty():
    assert simplify_tfl_line_status([]) == []

def test_simplify_tfl_line_status_missing_fields_omitted():
    response_json = [
        {},
        {"name": "Piccadilly"}
    ]
    result = simplify_tfl_line_status(response_json)
    assert result == []
