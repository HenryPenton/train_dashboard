from src.domain.tfl.arrivals.arrivals import ArrivalModel, ArrivalsList
from src.DAOs.tfl.arrival_dao import ArrivalDAO
from src.test.utils.dummy_logger import DummyLogger


def test_arrival_model_as_dict():
    arrival_dao = ArrivalDAO(
        id="123",
        lineId="circle",
        lineName="Circle",
        platformName="Platform 1",
        timeToStation=120,
        expectedArrival="2025-11-13T18:12:32Z",
        towards="Edgware Road",
    )

    arrival_model = ArrivalModel(arrival_dao)
    result = arrival_model.as_dict()

    assert result == {
        "id": "123",
        "lineId": "circle",
        "lineName": "Circle",
        "platformName": "Platform 1",
        "timeToStation": 120,
        "expectedArrival": "2025-11-13T18:12:32Z",
        "towards": "Edgware Road",
        "currentLocation": None,
        "destinationName": None,
        "direction": None,
    }


def test_arrivals_list_get_arrivals_by_line():
    arrival_daos = [
        ArrivalDAO(
            id="123",
            lineId="circle",
            lineName="Circle",
            platformName="Platform 1",
            timeToStation=180,
            expectedArrival="2025-11-13T18:15:32Z",
            towards="Edgware Road",
        ),
        ArrivalDAO(
            id="124",
            lineId="circle",
            lineName="Circle",
            platformName="Platform 1",
            timeToStation=60,
            expectedArrival="2025-11-13T18:10:32Z",
            towards="Hammersmith",
        ),
        ArrivalDAO(
            id="125",
            lineId="district",
            lineName="District",
            platformName="Platform 2",
            timeToStation=240,
            expectedArrival="2025-11-13T18:18:32Z",
            towards="Wimbledon",
        ),
    ]

    logger = DummyLogger()
    arrivals_list = ArrivalsList(arrival_daos, logger)
    result = arrivals_list.get_arrivals_by_line()

    # Check structure
    assert "lines" in result
    assert "circle" in result["lines"]
    assert "district" in result["lines"]

    # Check Circle line
    circle_line = result["lines"]["circle"]
    assert circle_line["lineName"] == "Circle"
    assert "Platform 1" in circle_line["arrivals"]

    # Check sorting (60 seconds should come before 180 seconds)
    platform_1_arrivals = circle_line["arrivals"]["Platform 1"]
    assert len(platform_1_arrivals) == 2
    assert platform_1_arrivals[0]["timeToStation"] == 60
    assert platform_1_arrivals[1]["timeToStation"] == 180

    # Check District line
    district_line = result["lines"]["district"]
    assert district_line["lineName"] == "District"
    assert "Platform 2" in district_line["arrivals"]
    assert len(district_line["arrivals"]["Platform 2"]) == 1


def test_arrivals_list_empty():
    logger = DummyLogger()
    arrivals_list = ArrivalsList([], logger)
    result = arrivals_list.get_arrivals_by_line()

    assert result == {"lines": {}}


def test_platform_name_transformations():
    """Test that platform names are correctly transformed from TfL terminology to user-friendly format."""
    test_cases = [
        # Inner rail transformations (case insensitive)
        ("inner rail", "Anti-Clockwise"),
        ("Inner Rail", "Anti-Clockwise"),
        ("INNER RAIL", "Anti-Clockwise"),
        ("platform inner rail", "Platform Anti-Clockwise"),
        ("Inner Rail Platform", "Anti-Clockwise Platform"),
        # Outer rail transformations (case insensitive)
        ("outer rail", "Clockwise"),
        ("Outer Rail", "Clockwise"),
        ("OUTER RAIL", "Clockwise"),
        ("platform outer rail", "Platform Clockwise"),
        ("Outer Rail Platform", "Clockwise Platform"),
        # No transformation needed
        ("Platform 1", "Platform 1"),
        ("Eastbound", "Eastbound"),
        ("platform", "Platform"),
        ("Platform", "Platform"),
    ]

    for input_platform, expected_output in test_cases:
        arrival_dao = ArrivalDAO(
            id="test",
            lineId="central",
            lineName="Central",
            platformName=input_platform,
            timeToStation=120,
            expectedArrival="2025-11-13T18:12:32Z",
            towards="Test Station",
        )

        arrival_model = ArrivalModel(arrival_dao)
        assert arrival_model.platform_name == expected_output, (
            f"Expected '{input_platform}' to transform to '{expected_output}', got '{arrival_model.platform_name}'"
        )
