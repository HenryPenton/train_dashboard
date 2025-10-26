import pytest
from src.adapters.schemas.tfl.line.line_schema import LineRecordSchema, LineStatusSchema


def valid_line_status():
    return {"statusSeverity": 10, "statusSeverityDescription": "Good Service"}


def test_line_status_schema_all_valid():
    schema = LineStatusSchema()
    data = valid_line_status()
    result = schema.load(data)
    assert result["statusSeverity"] == 10
    assert result["statusSeverityDescription"] == "Good Service"


def test_line_record_schema_all_valid():
    schema = LineRecordSchema()
    data = {
        "id": "central",
        "name": "Central Line",
        "lineStatuses": [valid_line_status(), valid_line_status()],
    }
    result = schema.load(data)
    assert result["id"] == "central"
    assert result["name"] == "Central Line"
    assert len(result["lineStatuses"]) == 2
    assert result["lineStatuses"][0]["statusSeverityDescription"] == "Good Service"


def test_line_record_schema_missing_statuses():
    schema = LineRecordSchema()
    data = {"id": "central", "name": "Central Line"}
    with pytest.raises(Exception):
        schema.load(data)


def test_line_status_schema_extra_fields():
    schema = LineStatusSchema()
    data = valid_line_status().copy()
    data["extraField"] = "should be ignored"
    result = schema.load(data)
    assert "extraField" not in result
