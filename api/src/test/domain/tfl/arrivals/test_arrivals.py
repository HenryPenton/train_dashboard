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
