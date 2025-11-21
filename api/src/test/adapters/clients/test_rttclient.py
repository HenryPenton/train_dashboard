import pytest
from src.adapters.clients.rttclient import RTTClient, RTTClientError
from src.DAOs.rail.departure_dao import DepartureDAO


class MockAsyncClient:
    def __init__(self, response):
        self._response = response

    async def get(self, url, auth=None):
        return self._response


class MockResponse:
    def __init__(self, status_code=200, json_data=None, raise_for_status_exc=None):
        self._status_code = status_code
        self._json_data = json_data or {}
        self._raise_for_status_exc = raise_for_status_exc

    def raise_for_status(self):
        if self._raise_for_status_exc:
            raise self._raise_for_status_exc

    def json(self):
        return self._json_data

    @property
    def status_code(self):
        return self._status_code


@pytest.mark.asyncio
async def test_get_departures_success():
    mock_json = {
        "services": [
            {
                "serviceUid": "gb-nr:12345",
                "runDate": "2024-06-01",
                "serviceType": "train",
                "locationDetail": {
                    "origin": [{"description": "Edinburgh"}],
                    "destination": [{"description": "Glasgow"}],
                    "gbttBookedDeparture": "0930",
                    "platform": "5",
                    "realtimeDeparture": "0935",
                },
            },
            {
                "serviceUid": "gb-nr:67890",
                "runDate": "2024-06-01",
                "serviceType": "train",
                "locationDetail": {
                    "origin": [{"description": "Oxford"}, {"description": "London"}],
                    "destination": [
                        {"description": "Manchester"},
                        {"description": "Liverpool"},
                    ],
                    "gbttBookedDeparture": "1015",
                    "platform": "2",
                    "realtimeDeparture": "1015",
                },
            },
        ]
    }
    mock_response = MockResponse(json_data=mock_json)
    client = RTTClient(MockAsyncClient(mock_response))
    result = await client.get_departures("ABC", "XYZ")

    assert isinstance(result, list)
    assert len(result) == 2
    assert all(isinstance(r, DepartureDAO) for r in result)
    # Check first Model fields
    assert result[0].origins == ["Edinburgh"]
    assert result[0].destinations == ["Glasgow"]
    assert result[0].scheduled_departure == "0930"
    assert result[0].real_departure == "0935"
    assert result[0].platform == "5"
    # Check second Model fields
    assert result[1].origins == ["Oxford", "London"]
    assert result[1].destinations == ["Manchester", "Liverpool"]
    assert result[1].scheduled_departure == "1015"
    assert result[1].real_departure == "1015"
    assert result[1].platform == "2"


@pytest.mark.asyncio
async def test_get_departures_error():
    class ErrorResponse(MockResponse):
        def raise_for_status(self):
            raise Exception("Something went wrong")

    mock_response = ErrorResponse()
    client = RTTClient(MockAsyncClient(mock_response))

    with pytest.raises(RTTClientError) as e:
        await client.get_departures("ABC", "XYZ")
    assert "RTTClient failed" in str(e.value)


@pytest.mark.asyncio
async def test_get_departures_invalid_model():
    # One valid, one invalid (missing required field 'origin')
    mock_json = {
        "services": [
            {
                "serviceUid": "gb-nr:12345",
                "runDate": "2024-06-01",
                "serviceType": "train",
                "locationDetail": {
                    "origin": [{"description": "Edinburgh"}],
                    "destination": [{"description": "Glasgow"}],
                    "gbttBookedDeparture": "0930",
                    "platform": "5",
                    "realtimeDeparture": "0935",
                },
            },
            {
                "serviceType": "train",
                "locationDetail": {
                    # Invalid: missing 'origin', 'destination', and 'gbttBookedDeparture'
                    "platform": "?",
                }
            },
        ]
    }
    mock_response = MockResponse(json_data=mock_json)
    client = RTTClient(MockAsyncClient(mock_response))
    result = await client.get_departures("ABC", "XYZ")

    # Only the valid model should be returned
    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0].origins == ["Edinburgh"]
    assert result[0].destinations == ["Glasgow"]
    assert result[0].scheduled_departure == "0930"
    assert result[0].real_departure == "0935"
    assert result[0].platform == "5"


@pytest.mark.asyncio
async def test_get_departures_filters_non_train_services():
    mock_json = {
        "services": [
            {
                "serviceUid": "gb-nr:12345",
                "runDate": "2024-06-01",
                "serviceType": "train",
                "locationDetail": {
                    "origin": [{"description": "Edinburgh"}],
                    "destination": [{"description": "Glasgow"}],
                    "gbttBookedDeparture": "0930",
                    "platform": "5",
                    "realtimeDeparture": "0935",
                },
            },
            {
                "serviceUid": "gb-nr:67890",
                "runDate": "2024-06-01",
                "serviceType": "bus",  # This should be filtered out
                "locationDetail": {
                    "origin": [{"description": "Station A"}],
                    "destination": [{"description": "Station B"}],
                    "gbttBookedDeparture": "1000",
                    "platform": "Bus Stop",
                    "realtimeDeparture": "1000",
                },
            },
            {
                "serviceUid": "gb-nr:11111",
                "runDate": "2024-06-01",
                "serviceType": "ship",  # This should be filtered out
                "locationDetail": {
                    "origin": [{"description": "Port A"}],
                    "destination": [{"description": "Port B"}],
                    "gbttBookedDeparture": "1100",
                    "platform": "Pier 1",
                    "realtimeDeparture": "1100",
                },
            },
            {
                "serviceUid": "gb-nr:22222",
                "runDate": "2024-06-01",
                "serviceType": "train",
                "locationDetail": {
                    "origin": [{"description": "London"}],
                    "destination": [{"description": "Manchester"}],
                    "gbttBookedDeparture": "1200",
                    "platform": "3",
                    "realtimeDeparture": "1205",
                },
            },
        ]
    }
    mock_response = MockResponse(json_data=mock_json)
    client = RTTClient(MockAsyncClient(mock_response))
    result = await client.get_departures("ABC", "XYZ")

    # Should only return the 2 train services, not the bus or ship
    assert isinstance(result, list)
    assert len(result) == 2
    assert all(isinstance(r, DepartureDAO) for r in result)

    # Check first train service
    assert result[0].origins == ["Edinburgh"]
    assert result[0].destinations == ["Glasgow"]
    assert result[0].scheduled_departure == "0930"

    # Check second train service
    assert result[1].origins == ["London"]
    assert result[1].destinations == ["Manchester"]
    assert result[1].scheduled_departure == "1200"
