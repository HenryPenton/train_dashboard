import pytest
from pydantic import ValidationError
from src.domain.tfl.lines.lines import LineStatus, LineStatuses
from src.DAOs.tfl.line_dao import LineDAO


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
        result = LineStatus(line).get_status()
        assert result == {
            "name": "Victoria",
            "status": "Good Service",
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
        result = LineStatus(line).get_status()
        assert result == {
            "name": "Northern",
            "status": "Minor Delays, Part Suspended",
            "statusSeverity": 4,
        }

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
        result = LineStatus(line).get_status()
        assert result == {
            "name": "Mildmay",
            "status": "Part Closure x2, Good Service",
            "statusSeverity": 3,
        }

    def test_empty(self):
        with pytest.raises(ValidationError):
            LineDAO(**{})


class TestLineStatuses:
    def test_empty(self):
        assert LineStatuses([]).get_line_statuses() == []

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
