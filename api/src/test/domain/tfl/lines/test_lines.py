import pytest
from pydantic import ValidationError
from src.DAOs.tfl.line_dao import LineDAO
from src.domain.tfl.lines.lines import LineStatusModel, LineStatusModelList
from src.test.utils.dummy_logger import DummyLogger


class TestLineStatus:
    def test_one_status(self):
        line = LineDAO(
            **{
                "name": "Victoria",
                "lineStatuses": [
                    {"statusSeverityDescription": "Good Service", "statusSeverity": 10}
                ],
            }
        )
        logger = DummyLogger()
        result = LineStatusModel(line, logger=logger)
        assert (result.as_dict()) == {
            "name": "Victoria",
            "statusList": ["Good Service"],
            "statusSeverity": 10,
        }

    def test_two_statuses(self):
        line = LineDAO(
            **{
                "name": "Northern",
                "lineStatuses": [
                    {"statusSeverityDescription": "Minor Delays", "statusSeverity": 6},
                    {
                        "statusSeverityDescription": "Part Suspended",
                        "statusSeverity": 4,
                    },
                ],
            }
        )
        logger = DummyLogger()
        result = LineStatusModel(line, logger=logger)
        expected_status_list = {"Minor Delays", "Part Suspended"}
        actual_status_list = set(result.as_dict()["statusList"])
        assert actual_status_list == expected_status_list
        assert (result.as_dict()["name"]) == "Northern"
        assert (result.as_dict()["statusSeverity"]) == 4

    def test_two_same_statuses(self):
        line = LineDAO(
            **{
                "name": "Mildmay",
                "lineStatuses": [
                    {"statusSeverityDescription": "Part Closure", "statusSeverity": 3},
                    {"statusSeverityDescription": "Part Closure", "statusSeverity": 3},
                    {"statusSeverityDescription": "Good Service", "statusSeverity": 10},
                ],
            }
        )
        logger = DummyLogger()
        result = LineStatusModel(line, logger=logger)
        expected_status_list = {"Part Closure", "Good Service"}
        actual_status_list = set(result.as_dict()["statusList"])
        assert actual_status_list == expected_status_list
        assert (result.as_dict()["name"]) == "Mildmay"
        assert (result.as_dict()["statusSeverity"]) == 3

    def test_empty(self):
        with pytest.raises(ValidationError):
            LineDAO(**{})


class TestLineStatuses:
    def test_empty(self):
        logger = DummyLogger()
        assert LineStatusModelList([], logger=logger).get_line_statuses() == []

    def test_one_line(self):
        lines = [
            LineDAO(
                **{
                    "name": "Victoria",
                    "lineStatuses": [
                        {
                            "statusSeverityDescription": "Good Service",
                            "statusSeverity": 10,
                        }
                    ],
                }
            )
        ]
        logger = DummyLogger()
        result = LineStatusModelList(lines, logger=logger).get_line_statuses()
        assert (result[0].as_dict()) == {
            "name": "Victoria",
            "statusList": ["Good Service"],
            "statusSeverity": 10,
        }

    def test_two_lines(self):
        lines = [
            LineDAO(
                **{
                    "name": "Northern",
                    "lineStatuses": [
                        {
                            "statusSeverityDescription": "Minor Delays",
                            "statusSeverity": 6,
                        },
                        {
                            "statusSeverityDescription": "Part Suspended",
                            "statusSeverity": 4,
                        },
                    ],
                }
            ),
            LineDAO(
                **{
                    "name": "Piccadilly",
                    "lineStatuses": [
                        {
                            "statusSeverityDescription": "Good Service",
                            "statusSeverity": 10,
                        },
                    ],
                }
            ),
        ]
        logger = DummyLogger()
        result = LineStatusModelList(lines, logger=logger).get_line_statuses()
        # Check Northern line
        northern_result = result[0].as_dict()
        assert northern_result["name"] == "Northern"
        assert northern_result["statusSeverity"] == 4
        expected_northern_statuses = {"Minor Delays", "Part Suspended"}
        actual_northern_statuses = set(northern_result["statusList"])
        assert actual_northern_statuses == expected_northern_statuses
        
        # Check Piccadilly line
        assert (result[1].as_dict()) == {
            "name": "Piccadilly",
            "statusList": ["Good Service"],
            "statusSeverity": 10,
        }
