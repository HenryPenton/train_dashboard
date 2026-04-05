import pytest
from datetime import datetime, timezone, timedelta
from src.adapters.clients.rttclient_v2 import RTTClientV2, RTTClientV2Error, TOKEN_EXCHANGE_URL, LOCATION_URL
from src.DAOs.rail.departure_dao import DepartureDAO


FUTURE_EXPIRY = "2099-01-01T00:00:00Z"
PAST_EXPIRY = "2000-01-01T00:00:00Z"
ACCESS_TOKEN = "short-lived-access-token"


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


class MockAsyncClient:
    """Returns different responses depending on which URL is called."""

    def __init__(self, token_response, location_response):
        self._token_response = token_response
        self._location_response = location_response
        self.calls = []

    async def get(self, url, params=None, headers=None):
        self.calls.append({"url": url, "params": params, "headers": headers})
        if url == TOKEN_EXCHANGE_URL:
            return self._token_response
        return self._location_response


def _token_response(expiry=FUTURE_EXPIRY):
    return MockResponse(json_data={"token": ACCESS_TOKEN, "validUntil": expiry, "entitlements": []})


def _make_v2_service(**overrides):
    service = {
        "scheduleMetadata": {
            "uniqueIdentity": "gb-nr:L01525:2025-10-26",
            "namespace": "gb-nr",
            "identity": "L01525",
            "departureDate": "2025-10-26",
            "operator": {"code": "SR", "name": "ScotRail"},
            "modeType": "TRAIN",
            "inPassengerService": True,
        },
        "temporalData": {
            "departure": {
                "scheduleAdvertised": "2025-10-26T09:30:00Z",
                "realtimeActual": "2025-10-26T09:35:00Z",
            },
            "displayAs": "CALL",
        },
        "locationMetadata": {
            "platform": {"planned": "5", "actual": "5"},
        },
        "origin": [{"location": {"description": "Edinburgh", "namespace": "gb-nr"}}],
        "destination": [{"location": {"description": "Glasgow", "namespace": "gb-nr"}}],
    }
    service.update(overrides)
    return service


@pytest.mark.asyncio
async def test_get_departures_success():
    location_json = {
        "systemStatus": {"realtimeNetworkRail": "OK", "rttCore": "OK"},
        "services": [_make_v2_service()],
    }
    mock_http = MockAsyncClient(_token_response(), MockResponse(json_data=location_json))
    result = await RTTClientV2(mock_http).get_departures("EDB", "GLQ")

    assert len(result) == 1
    assert isinstance(result[0], DepartureDAO)
    assert result[0].origins == ["Edinburgh"]
    assert result[0].destinations == ["Glasgow"]
    assert result[0].scheduled_departure == "0930"
    assert result[0].real_departure == "0935"
    assert result[0].platform == "5"


@pytest.mark.asyncio
async def test_exchanges_refresh_token_before_request(monkeypatch):
    monkeypatch.setenv("RTT_API_BEARER_TOKEN", "my-refresh-token")
    mock_http = MockAsyncClient(_token_response(), MockResponse(json_data={"services": []}))
    await RTTClientV2(mock_http).get_departures("EDB", "GLQ")

    token_call = mock_http.calls[0]
    assert token_call["url"] == TOKEN_EXCHANGE_URL
    assert token_call["headers"] == {"Authorization": "Bearer my-refresh-token"}


@pytest.mark.asyncio
async def test_uses_access_token_for_location_request():
    mock_http = MockAsyncClient(_token_response(), MockResponse(json_data={"services": []}))
    await RTTClientV2(mock_http).get_departures("EDB", "GLQ")

    location_call = mock_http.calls[1]
    assert location_call["url"] == LOCATION_URL
    assert location_call["headers"] == {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    assert location_call["params"] == {"code": "EDB", "filterTo": "GLQ"}


@pytest.mark.asyncio
async def test_caches_access_token_across_requests():
    mock_http = MockAsyncClient(_token_response(), MockResponse(json_data={"services": []}))
    client = RTTClientV2(mock_http)
    await client.get_departures("EDB", "GLQ")
    await client.get_departures("EDB", "GLQ")

    token_calls = [c for c in mock_http.calls if c["url"] == TOKEN_EXCHANGE_URL]
    assert len(token_calls) == 1


@pytest.mark.asyncio
async def test_refreshes_expired_access_token():
    mock_http = MockAsyncClient(_token_response(PAST_EXPIRY), MockResponse(json_data={"services": []}))
    client = RTTClientV2(mock_http)
    # Simulate a previously cached but expired token
    client._access_token = "old-token"
    client._token_valid_until = datetime(2000, 1, 1, tzinfo=timezone.utc)

    await client.get_departures("EDB", "GLQ")

    token_calls = [c for c in mock_http.calls if c["url"] == TOKEN_EXCHANGE_URL]
    assert len(token_calls) == 1


@pytest.mark.asyncio
async def test_token_exchange_failure_raises_error():
    import httpx

    class FailTokenResponse(MockResponse):
        def raise_for_status(self):
            mock_req = httpx.Request("GET", TOKEN_EXCHANGE_URL)
            mock_resp = httpx.Response(401, request=mock_req, text='{"error":"Invalid token"}')
            raise httpx.HTTPStatusError("401", request=mock_req, response=mock_resp)

    mock_http = MockAsyncClient(FailTokenResponse(), MockResponse(json_data={"services": []}))
    with pytest.raises(RTTClientV2Error) as exc:
        await RTTClientV2(mock_http).get_departures("EDB", "GLQ")
    assert "token exchange failed" in str(exc.value)
    assert "401" in str(exc.value)


@pytest.mark.asyncio
async def test_location_request_failure_raises_error():
    import httpx

    class FailLocationResponse(MockResponse):
        def raise_for_status(self):
            mock_req = httpx.Request("GET", LOCATION_URL)
            mock_resp = httpx.Response(500, request=mock_req, text="Server error")
            raise httpx.HTTPStatusError("500", request=mock_req, response=mock_resp)

    mock_http = MockAsyncClient(_token_response(), FailLocationResponse())
    with pytest.raises(RTTClientV2Error) as exc:
        await RTTClientV2(mock_http).get_departures("EDB", "GLQ")
    assert "RTTClientV2 failed: HTTP 500" in str(exc.value)


@pytest.mark.asyncio
async def test_filters_non_train_services():
    bus_service = _make_v2_service()
    bus_service["scheduleMetadata"]["modeType"] = "BUS"
    location_json = {"services": [_make_v2_service(), bus_service]}
    mock_http = MockAsyncClient(_token_response(), MockResponse(json_data=location_json))
    result = await RTTClientV2(mock_http).get_departures("EDB", "GLQ")

    assert len(result) == 1
