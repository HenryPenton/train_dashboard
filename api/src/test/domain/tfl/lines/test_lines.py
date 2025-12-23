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
            "statuses": [{"status": "Good Service", "reason": None}],
            "statusSeverity": 10,
        }

    def test_status_with_reason(self):
        line = LineDAO(
            **{
                "name": "Central",
                "lineStatuses": [
                    {
                        "statusSeverityDescription": "Minor Delays",
                        "statusSeverity": 6,
                        "reason": "Central Line: Minor delays due to an earlier signal failure at Liverpool Street.",
                    }
                ],
            }
        )
        logger = DummyLogger()
        result = LineStatusModel(line, logger=logger)
        assert (result.as_dict()) == {
            "name": "Central",
            "statuses": [
                {
                    "status": "Minor Delays",
                    "reason": "Central Line: Minor delays due to an earlier signal failure at Liverpool Street.",
                }
            ],
            "statusSeverity": 6,
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
        statuses = result.as_dict()["statuses"]
        status_names = {s["status"] for s in statuses}
        assert status_names == {"Minor Delays", "Part Suspended"}
        assert (result.as_dict()["name"]) == "Northern"
        assert (result.as_dict()["statusSeverity"]) == 4

    def test_two_statuses_with_reason(self):
        line = LineDAO(
            **{
                "name": "Northern",
                "lineStatuses": [
                    {"statusSeverityDescription": "Minor Delays", "statusSeverity": 6},
                    {
                        "statusSeverityDescription": "Part Suspended",
                        "statusSeverity": 4,
                        "reason": "Northern Line: Part suspended between Moorgate and Kennington due to planned "
                        "engineering work.",
                    },
                ],
            }
        )
        logger = DummyLogger()
        result = LineStatusModel(line, logger=logger)
        statuses = result.as_dict()["statuses"]
        status_names = {s["status"] for s in statuses}
        assert status_names == {"Minor Delays", "Part Suspended"}
        assert (result.as_dict()["name"]) == "Northern"
        assert (result.as_dict()["statusSeverity"]) == 4
        # Find the Part Suspended status and check its reason
        part_suspended = next(s for s in statuses if s["status"] == "Part Suspended")
        assert (
            part_suspended["reason"]
            == "Northern Line: Part suspended between Moorgate and Kennington due to planned engineering work."
        )

    def test_two_same_statuses_without_reasons_deduped(self):
        """When multiple statuses have the same description and no reasons,
        they should be deduplicated."""
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
        statuses = result.as_dict()["statuses"]
        status_names = [s["status"] for s in statuses]
        # Should dedupe to just one Part Closure and one Good Service
        assert status_names.count("Part Closure") == 1
        assert status_names.count("Good Service") == 1
        assert (result.as_dict()["name"]) == "Mildmay"
        assert (result.as_dict()["statusSeverity"]) == 3

    def test_two_same_statuses_with_different_reasons_kept_separate(self):
        """When multiple statuses have the same description but different reasons,
        they should be kept as separate entries to show different reasons."""
        line = LineDAO(
            **{
                "name": "District",
                "lineStatuses": [
                    {
                        "statusSeverityDescription": "Severe Delays",
                        "statusSeverity": 2,
                        "reason": "District Line: Severe delays between Earl's Court and Wimbledon due to signal failure.",
                    },
                    {
                        "statusSeverityDescription": "Severe Delays",
                        "statusSeverity": 2,
                        "reason": "District Line: Severe delays between Tower Hill and Upminster due to a person ill on a train.",
                    },
                ],
            }
        )
        logger = DummyLogger()
        result = LineStatusModel(line, logger=logger)
        statuses = result.as_dict()["statuses"]
        # Should keep both Severe Delays entries as they have different reasons
        assert len(statuses) == 2
        assert statuses[0]["status"] == "Severe Delays"
        assert statuses[1]["status"] == "Severe Delays"
        reasons = {s["reason"] for s in statuses}
        assert reasons == {
            "District Line: Severe delays between Earl's Court and Wimbledon due to signal failure.",
            "District Line: Severe delays between Tower Hill and Upminster due to a person ill on a train.",
        }

    def test_same_statuses_with_same_reasons_deduped(self):
        """When multiple statuses have the same description AND the same reason,
        they should be deduplicated."""
        line = LineDAO(
            **{
                "name": "Jubilee",
                "lineStatuses": [
                    {
                        "statusSeverityDescription": "Minor Delays",
                        "statusSeverity": 6,
                        "reason": "Jubilee Line: Minor delays due to an earlier signal failure.",
                    },
                    {
                        "statusSeverityDescription": "Minor Delays",
                        "statusSeverity": 6,
                        "reason": "Jubilee Line: Minor delays due to an earlier signal failure.",
                    },
                ],
            }
        )
        logger = DummyLogger()
        result = LineStatusModel(line, logger=logger)
        statuses = result.as_dict()["statuses"]
        # Should dedupe to just one entry since both status and reason are identical
        assert len(statuses) == 1
        assert statuses[0]["status"] == "Minor Delays"
        assert (
            statuses[0]["reason"]
            == "Jubilee Line: Minor delays due to an earlier signal failure."
        )

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
            "statuses": [{"status": "Good Service", "reason": None}],
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
        northern_statuses = {s["status"] for s in northern_result["statuses"]}
        assert northern_statuses == {"Minor Delays", "Part Suspended"}

        # Check Piccadilly line
        assert (result[1].as_dict()) == {
            "name": "Piccadilly",
            "statuses": [{"status": "Good Service", "reason": None}],
            "statusSeverity": 10,
        }
