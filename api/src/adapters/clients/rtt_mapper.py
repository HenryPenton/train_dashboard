from typing import List

from src.DAOs.rail.departure_dao import DepartureDAO, DeparturesDAO


class RTTMapper:
    @staticmethod
    def to_departures_dao(response_json: dict) -> DeparturesDAO:
        return DeparturesDAO(**response_json)

    @staticmethod
    def to_departure_dao(service: dict) -> DepartureDAO:
        location_detail = service.get("locationDetail", {})
        service_uid = service.get("serviceUid", "")
        run_date = service.get("runDate", "")
        return DepartureDAO(**location_detail, serviceUid=service_uid, runDate=run_date)

    @staticmethod
    def is_train_service(service: dict) -> bool:
        return service.get("serviceType", "") == "train"

    @classmethod
    def to_departure_dao_list(cls, response_json: dict) -> List[DepartureDAO]:
        departures_dao = cls.to_departures_dao(response_json)
        departures = []
        for service in departures_dao.services:
            if not cls.is_train_service(service):
                continue
            try:
                departures.append(cls.to_departure_dao(service))
            except Exception:
                continue
        return departures
