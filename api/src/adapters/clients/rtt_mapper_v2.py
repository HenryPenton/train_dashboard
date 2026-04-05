from typing import List, Optional

from src.DAOs.rail.departure_dao import DepartureDAO

DISPLAY_AS_MAP = {
    "CALL": "CALL",
    "CANCELLED": "CANCELLED_CALL",
    "DIVERTED": "CANCELLED_CALL",
    "STARTS": "STARTS",
    "TERMINATES": "TERMINATES",
}


class RTTMapperV2:
    @staticmethod
    def _extract_time(iso_datetime: Optional[str]) -> Optional[str]:
        if not iso_datetime:
            return None
        try:
            time_part = iso_datetime.split("T")[1] if "T" in iso_datetime else None
            if time_part is None:
                return None
            hh = time_part[0:2]
            mm = time_part[3:5]
            return f"{hh}{mm}"
        except (IndexError, ValueError):
            return None

    @staticmethod
    def _extract_platform(location_metadata: dict) -> Optional[str]:
        platform_data = location_metadata.get("platform", {})
        if not platform_data:
            return None
        return platform_data.get("actual") or platform_data.get("planned")

    @staticmethod
    def _map_display_as(display_as: Optional[str]) -> Optional[str]:
        if display_as is None:
            return None
        return DISPLAY_AS_MAP.get(display_as)

    @staticmethod
    def _extract_origins(origin_list: list) -> list:
        return [
            {"description": item["location"]["description"]}
            for item in origin_list
            if "location" in item and "description" in item["location"]
        ]

    @staticmethod
    def _extract_destinations(destination_list: list) -> list:
        return [
            {"description": item["location"]["description"]}
            for item in destination_list
            if "location" in item and "description" in item["location"]
        ]

    @staticmethod
    def is_train_service(service: dict) -> bool:
        schedule = service.get("scheduleMetadata", {})
        return schedule.get("modeType", "") == "TRAIN"

    @classmethod
    def to_departure_dao(cls, service: dict) -> DepartureDAO:
        schedule = service.get("scheduleMetadata", {})
        temporal = service.get("temporalData", {})
        departure_temporal = temporal.get("departure", {})
        location_metadata = service.get("locationMetadata", {})

        booked = cls._extract_time(departure_temporal.get("scheduleAdvertised"))
        realtime = cls._extract_time(departure_temporal.get("realtimeActual"))
        platform = cls._extract_platform(location_metadata)
        display_as = cls._map_display_as(temporal.get("displayAs"))
        origin = cls._extract_origins(service.get("origin", []))
        destination = cls._extract_destinations(service.get("destination", []))
        service_uid = schedule.get("identity", "")
        run_date = schedule.get("departureDate", "")

        return DepartureDAO(
            origin=origin,
            destination=destination,
            gbttBookedDeparture=booked,
            serviceUid=service_uid,
            runDate=run_date,
            realtimeDeparture=realtime,
            platform=platform,
            displayAs=display_as,
        )

    @classmethod
    def to_departure_dao_list(cls, response_json: dict) -> List[DepartureDAO]:
        services = response_json.get("services", []) or []
        departures = []
        for service in services:
            if not cls.is_train_service(service):
                continue
            try:
                departures.append(cls.to_departure_dao(service))
            except Exception:
                continue
        return departures
