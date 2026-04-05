import pytest
from src.adapters.clients.rtt_mapper import RTTMapper
from src.DAOs.rail.departure_dao import DepartureDAO, DeparturesDAO


class TestToDepaturesDoa:
    def test_maps_response_json_to_departures_dao(self):
        response_json = {
            "services": [
                {"serviceType": "train", "serviceUid": "abc"},
            ]
        }
        result = RTTMapper.to_departures_dao(response_json)
        assert isinstance(result, DeparturesDAO)
        assert len(result.services) == 1

    def test_handles_none_services(self):
        result = RTTMapper.to_departures_dao({"services": None})
        assert result.services == []

    def test_handles_missing_services(self):
        result = RTTMapper.to_departures_dao({})
        assert result.services == []


class TestToDepartureDao:
    def test_maps_service_to_departure_dao(self):
        service = {
            "serviceUid": "W12345",
            "runDate": "2024-06-01",
            "serviceType": "train",
            "locationDetail": {
                "origin": [{"description": "Edinburgh"}],
                "destination": [{"description": "Glasgow"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
            },
        }
        result = RTTMapper.to_departure_dao(service)
        assert isinstance(result, DepartureDAO)
        assert result.origins == ["Edinburgh"]
        assert result.destinations == ["Glasgow"]
        assert result.scheduled_departure == "0930"
        assert result.real_departure == "0935"
        assert result.platform == "5"
        assert result.serviceUid == "W12345"
        assert result.runDate == "2024-06-01"

    def test_defaults_missing_optional_fields(self):
        service = {
            "serviceUid": "W12345",
            "runDate": "2024-06-01",
            "locationDetail": {
                "origin": [{"description": "Edinburgh"}],
                "destination": [{"description": "Glasgow"}],
                "gbttBookedDeparture": "0930",
            },
        }
        result = RTTMapper.to_departure_dao(service)
        assert result.platform is None
        assert result.real_departure is None

    def test_raises_on_missing_required_fields(self):
        service = {
            "serviceUid": "W12345",
            "runDate": "2024-06-01",
            "locationDetail": {
                "platform": "5",
            },
        }
        with pytest.raises(Exception):
            RTTMapper.to_departure_dao(service)


class TestIsTrainService:
    def test_returns_true_for_train(self):
        assert RTTMapper.is_train_service({"serviceType": "train"}) is True

    def test_returns_false_for_bus(self):
        assert RTTMapper.is_train_service({"serviceType": "bus"}) is False

    def test_returns_false_for_missing_type(self):
        assert RTTMapper.is_train_service({}) is False


class TestToDepartureDaoList:
    def test_maps_full_response_to_list_of_daos(self):
        response_json = {
            "services": [
                {
                    "serviceUid": "W12345",
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
                    "serviceUid": "W67890",
                    "runDate": "2024-06-01",
                    "serviceType": "train",
                    "locationDetail": {
                        "origin": [{"description": "London"}],
                        "destination": [{"description": "Manchester"}],
                        "gbttBookedDeparture": "1015",
                        "platform": "2",
                        "realtimeDeparture": "1015",
                    },
                },
            ]
        }
        result = RTTMapper.to_departure_dao_list(response_json)
        assert len(result) == 2
        assert all(isinstance(r, DepartureDAO) for r in result)

    def test_filters_non_train_services(self):
        response_json = {
            "services": [
                {
                    "serviceUid": "W12345",
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
                    "serviceUid": "W67890",
                    "runDate": "2024-06-01",
                    "serviceType": "bus",
                    "locationDetail": {
                        "origin": [{"description": "London"}],
                        "destination": [{"description": "Manchester"}],
                        "gbttBookedDeparture": "1015",
                        "platform": "2",
                    },
                },
            ]
        }
        result = RTTMapper.to_departure_dao_list(response_json)
        assert len(result) == 1
        assert result[0].origins == ["Edinburgh"]

    def test_skips_invalid_services(self):
        response_json = {
            "services": [
                {
                    "serviceUid": "W12345",
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
                        "platform": "?",
                    },
                },
            ]
        }
        result = RTTMapper.to_departure_dao_list(response_json)
        assert len(result) == 1

    def test_returns_empty_list_when_no_services(self):
        result = RTTMapper.to_departure_dao_list({"services": None})
        assert result == []
