from src.adapters.clients.rtt_mapper_v2 import RTTMapperV2
from src.DAOs.rail.departure_dao import DepartureDAO


def _make_v2_service(
    identity="L01525",
    departure_date="2025-10-26",
    mode_type="TRAIN",
    schedule_advertised="2025-10-26T09:30:00Z",
    realtime_actual="2025-10-26T09:35:00Z",
    platform_planned="5",
    platform_actual="5",
    display_as="CALL",
    origins=None,
    destinations=None,
):
    if origins is None:
        origins = [{"location": {"description": "Edinburgh", "namespace": "gb-nr"}}]
    if destinations is None:
        destinations = [{"location": {"description": "Glasgow", "namespace": "gb-nr"}}]

    return {
        "scheduleMetadata": {
            "uniqueIdentity": f"gb-nr:{identity}:{departure_date}",
            "namespace": "gb-nr",
            "identity": identity,
            "departureDate": departure_date,
            "operator": {"code": "SR", "name": "ScotRail"},
            "modeType": mode_type,
            "inPassengerService": True,
        },
        "temporalData": {
            "departure": {
                "scheduleAdvertised": schedule_advertised,
                "realtimeActual": realtime_actual,
            },
            "displayAs": display_as,
        },
        "locationMetadata": {
            "platform": {
                "planned": platform_planned,
                "actual": platform_actual,
            },
        },
        "origin": origins,
        "destination": destinations,
    }


class TestExtractTime:
    def test_extracts_hhmm_from_iso_datetime(self):
        assert RTTMapperV2._extract_time("2025-10-26T09:30:00Z") == "0930"

    def test_extracts_hhmm_with_offset(self):
        assert RTTMapperV2._extract_time("2025-10-26T14:05:00+01:00") == "1405"

    def test_returns_none_for_none(self):
        assert RTTMapperV2._extract_time(None) is None

    def test_returns_none_for_empty_string(self):
        assert RTTMapperV2._extract_time("") is None

    def test_returns_none_for_date_only(self):
        assert RTTMapperV2._extract_time("2025-10-26") is None


class TestExtractPlatform:
    def test_returns_actual_when_present(self):
        metadata = {"platform": {"planned": "3", "actual": "5"}}
        assert RTTMapperV2._extract_platform(metadata) == "5"

    def test_falls_back_to_planned(self):
        metadata = {"platform": {"planned": "3", "actual": None}}
        assert RTTMapperV2._extract_platform(metadata) == "3"

    def test_returns_none_when_no_platform(self):
        assert RTTMapperV2._extract_platform({}) is None

    def test_returns_none_when_platform_is_none(self):
        assert RTTMapperV2._extract_platform({"platform": None}) is None


class TestMapDisplayAs:
    def test_maps_call(self):
        assert RTTMapperV2._map_display_as("CALL") == "CALL"

    def test_maps_cancelled_to_cancelled_call(self):
        assert RTTMapperV2._map_display_as("CANCELLED") == "CANCELLED_CALL"

    def test_maps_diverted_to_cancelled_call(self):
        assert RTTMapperV2._map_display_as("DIVERTED") == "CANCELLED_CALL"

    def test_maps_starts(self):
        assert RTTMapperV2._map_display_as("STARTS") == "STARTS"

    def test_maps_terminates(self):
        assert RTTMapperV2._map_display_as("TERMINATES") == "TERMINATES"

    def test_returns_none_for_none(self):
        assert RTTMapperV2._map_display_as(None) is None

    def test_returns_none_for_unknown(self):
        assert RTTMapperV2._map_display_as("UNKNOWN") is None


class TestIsTrainService:
    def test_returns_true_for_train(self):
        service = _make_v2_service(mode_type="TRAIN")
        assert RTTMapperV2.is_train_service(service) is True

    def test_returns_false_for_bus(self):
        service = _make_v2_service(mode_type="BUS")
        assert RTTMapperV2.is_train_service(service) is False

    def test_returns_false_for_ship(self):
        service = _make_v2_service(mode_type="SHIP")
        assert RTTMapperV2.is_train_service(service) is False

    def test_returns_false_for_missing_metadata(self):
        assert RTTMapperV2.is_train_service({}) is False


class TestToDepartureDao:
    def test_maps_v2_service_to_departure_dao(self):
        service = _make_v2_service()
        result = RTTMapperV2.to_departure_dao(service)

        assert isinstance(result, DepartureDAO)
        assert result.origins == ["Edinburgh"]
        assert result.destinations == ["Glasgow"]
        assert result.scheduled_departure == "0930"
        assert result.real_departure == "0935"
        assert result.platform == "5"
        assert result.serviceUid == "L01525"
        assert result.runDate == "2025-10-26"
        assert result.displayAs == "CALL"

    def test_maps_multiple_origins_and_destinations(self):
        service = _make_v2_service(
            origins=[
                {"location": {"description": "Oxford", "namespace": "gb-nr"}},
                {"location": {"description": "London", "namespace": "gb-nr"}},
            ],
            destinations=[
                {"location": {"description": "Manchester", "namespace": "gb-nr"}},
                {"location": {"description": "Liverpool", "namespace": "gb-nr"}},
            ],
        )
        result = RTTMapperV2.to_departure_dao(service)
        assert result.origins == ["Oxford", "London"]
        assert result.destinations == ["Manchester", "Liverpool"]

    def test_handles_no_realtime_actual(self):
        service = _make_v2_service(realtime_actual=None)
        result = RTTMapperV2.to_departure_dao(service)
        assert result.real_departure is None

    def test_maps_cancelled_display_as(self):
        service = _make_v2_service(display_as="CANCELLED")
        result = RTTMapperV2.to_departure_dao(service)
        assert result.displayAs == "CANCELLED_CALL"

    def test_handles_null_display_as(self):
        service = _make_v2_service(display_as=None)
        service["temporalData"]["displayAs"] = None
        result = RTTMapperV2.to_departure_dao(service)
        assert result.displayAs is None


class TestToDepartureDaoList:
    def test_maps_full_v2_response(self):
        response = {
            "systemStatus": {"realtimeNetworkRail": "OK", "rttCore": "OK"},
            "services": [
                _make_v2_service(identity="L01525"),
                _make_v2_service(identity="L01600"),
            ],
        }
        result = RTTMapperV2.to_departure_dao_list(response)
        assert len(result) == 2
        assert all(isinstance(r, DepartureDAO) for r in result)

    def test_filters_non_train_services(self):
        response = {
            "services": [
                _make_v2_service(mode_type="TRAIN"),
                _make_v2_service(mode_type="BUS"),
                _make_v2_service(mode_type="SHIP"),
                _make_v2_service(mode_type="TRAIN"),
            ],
        }
        result = RTTMapperV2.to_departure_dao_list(response)
        assert len(result) == 2

    def test_skips_invalid_services(self):
        response = {
            "services": [
                _make_v2_service(),
                {
                    "scheduleMetadata": {"modeType": "TRAIN"},
                    "temporalData": {},
                },
            ],
        }
        result = RTTMapperV2.to_departure_dao_list(response)
        assert len(result) == 1

    def test_returns_empty_list_when_no_services(self):
        assert RTTMapperV2.to_departure_dao_list({"services": None}) == []

    def test_returns_empty_list_when_services_missing(self):
        assert RTTMapperV2.to_departure_dao_list({}) == []
