from src.models.external_to_python.departure.departure_model import DepartureModel
import pytest
from src.adapters.clients.rttclient import RTTClient, RTTClientError


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
                "locationDetail": {
                    "origin": [{"description": "Edinburgh"}],
                    "destination": [{"description": "Glasgow"}],
                    "gbttBookedDeparture": "0930",
                    "platform": "5",
                    "realtimeDeparture": "0935",
                }
            },
            {
                "locationDetail": {
                    "origin": [{"description": "Oxford"}, {"description": "London"}],
                    "destination": [
                        {"description": "Manchester"},
                        {"description": "Liverpool"},
                    ],
                    "gbttBookedDeparture": "1015",
                    "platform": "2",
                    "realtimeDeparture": "1015",
                }
            },
        ]
    }
    mock_response = MockResponse(json_data=mock_json)
    client = RTTClient(MockAsyncClient(mock_response))
    result = await client.get_departures("ABC", "XYZ")

    assert isinstance(result, list)
    assert len(result) == 2
    assert all(isinstance(r, DepartureModel) for r in result)
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
                "locationDetail": {
                    "origin": [{"description": "Edinburgh"}],
                    "destination": [{"description": "Glasgow"}],
                    "gbttBookedDeparture": "0930",
                    "platform": "5",
                    "realtimeDeparture": "0935",
                }
            },
            {
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
