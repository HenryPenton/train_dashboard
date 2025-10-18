from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)


class RailDeparture:
    def __init__(self, location_detail: dict):
        self.origin = self._get_origin(location_detail)
        self.destination = self._get_destination(location_detail)
        self.scheduled = self._get_scheduled(location_detail)
        self.platform = self._get_platform(location_detail)
        self.real = self._get_real(location_detail)
        self.delay = self._get_delay(self.scheduled, self.real)
        self.status = self._get_status(self.delay)
        self.actual = self._get_actual(self.scheduled, self.delay)

    @staticmethod
    def _get_origin(loc):
        origins = loc.get("origin", [])
        if len(origins) == 0:
            return None
        return ", ".join([origin.get("description", "") for origin in origins])

    @staticmethod
    def _get_destination(loc):
        destinations = loc.get("destination", [])
        if len(destinations) == 0:
            return None
        return ", ".join(
            [destination.get("description", "") for destination in destinations]
        )

    @staticmethod
    def _get_scheduled(loc):
        return loc.get("gbttBookedDeparture")

    @staticmethod
    def _get_platform(loc):
        return loc.get("platform")

    @staticmethod
    def _get_real(loc):
        return loc.get("realtimeDeparture")

    @staticmethod
    def _parse_time(t: str):
        if not t:
            return None
        if len(t) in (4, 6):
            return int(t[:2]) * 60 + int(t[2:4])
        return None

    @classmethod
    def _get_delay(cls, scheduled: str, real: str):
        sched_min = cls._parse_time(scheduled)
        real_min = cls._parse_time(real)
        if sched_min is not None and real_min is not None:
            return real_min - sched_min
        return None

    @staticmethod
    def _get_status(delay: int):
        if delay is None:
            return None
        if delay > 0:
            return "Late"
        if delay < 0:
            return "Early"
        if delay == 0:
            return "On time"

    @classmethod
    def _get_actual(cls, scheduled: int, delay: int):
        sched_min = cls._parse_time(scheduled)
        if sched_min is not None:
            delay_to_add = delay if delay is not None else 0
            actual_min = sched_min + delay_to_add
            actual_h = actual_min // 60
            actual_m = actual_min % 60
            return f"{actual_h:02d}{actual_m:02d}"
        return None

    def is_valid(self):
        return check_group_of_properties_exist(
            self.origin,
            self.destination,
            self.scheduled,
            self.platform,
            self.real,
            self.delay,
            self.status,
            self.actual,
        )

    def get_rail_departure(self):
        return {
            "origin": self.origin,
            "destination": self.destination,
            "platform": self.platform,
            "delay": self.delay,
            "status": self.status,
            "actual": self.actual,
        }


class RailDepartures:
    def __init__(self, all_services: dict):
        self.departures = self._extract_departures(all_services)

    @staticmethod
    def _extract_departures(all_services: dict) -> list[RailDeparture]:
        services = all_services.get("services", [])
        departures = []
        for dep in services:
            loc = dep.get("locationDetail", {})
            departure = RailDeparture(loc)
            if departure.is_valid():
                departures.append(departure.get_rail_departure())

        return departures

    def get_all_rail_departures(self) -> list[dict]:
        return self.departures
