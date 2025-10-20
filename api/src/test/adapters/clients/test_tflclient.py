import pytest
from src.adapters.clients.tflclient import (
    TFLClient,
    TFLClientError,
    JourneyRecord,
    LineRecord,
)


class MockAsyncClient:
    def __init__(self, response):
        self._response = response

    async def get(self, url):
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
async def test_get_best_route_success():
    mock_json = {
        "journeys": [
            {"duration": 25, "legs": [], "arrivalDateTime": "2025-10-19T10:30:00Z"}
        ]
    }
    mock_response = MockResponse(json_data=mock_json)
    client = TFLClient(MockAsyncClient(mock_response))
    result = await client.get_possible_route_journeys("Paddington", "Liverpool Street")
    assert all(isinstance(r, JourneyRecord) for r in result)

    assert result[0].legs == []
    assert result[0].duration == 25
    assert result[0].arrival == "2025-10-19T10:30:00Z"


@pytest.mark.asyncio
async def test_get_best_route_error():
    class ErrorResponse(MockResponse):
        def raise_for_status(self):
            raise Exception("Something went wrong")

    mock_response = ErrorResponse()
    client = TFLClient(MockAsyncClient(mock_response))
    with pytest.raises(TFLClientError) as e:
        await client.get_possible_route_journeys("Paddington", "Liverpool Street")
    assert "TFLClient failed" in str(e.value)


@pytest.mark.asyncio
async def test_get_all_lines_status_success():
    mock_json = [
        {
            "id": "central",
            "name": "Central",
            "lineStatuses": [
                {"statusSeverityDescription": "Good Service", "statusSeverity": 10}
            ],
        }
    ]
    mock_response = MockResponse(json_data=mock_json)
    client = TFLClient(MockAsyncClient(mock_response))
    result = await client.get_all_lines_status()
    assert isinstance(result, list)
    assert all(isinstance(r, LineRecord) for r in result)
    assert result[0].id == "central"
    assert result[0].line_statuses[0]["statusSeverityDescription"] == "Good Service"


@pytest.mark.asyncio
async def test_get_all_lines_status_error():
    class ErrorResponse(MockResponse):
        def raise_for_status(self):
            raise Exception("Something went wrong")

    mock_response = ErrorResponse()
    client = TFLClient(MockAsyncClient(mock_response))
    with pytest.raises(TFLClientError) as e:
        await client.get_all_lines_status()
    assert "TFLClient failed" in str(e.value)
