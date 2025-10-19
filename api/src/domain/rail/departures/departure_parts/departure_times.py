from src.shared.utils.time import twenty_four_hour_string_to_minutes
from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)


class RailDepartureTimes:
    def __init__(self, location_detail: dict):
        self.scheduled = self._get_scheduled(location_detail)
        self.real = self._get_real(location_detail)
        self.delay = self._get_delay(self.scheduled, self.real)
        self.status = self._get_status(self.delay)
        self.actual = self._get_actual(self.scheduled, self.delay)

    @staticmethod
    def _get_scheduled(loc):
        return loc.get("gbttBookedDeparture")

    @staticmethod
    def _get_real(loc):
        return loc.get("realtimeDeparture")

    @classmethod
    def _get_delay(cls, scheduled: str, real: str):
        sched_min = twenty_four_hour_string_to_minutes(scheduled)
        real_min = twenty_four_hour_string_to_minutes(real)
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
        sched_min = twenty_four_hour_string_to_minutes(scheduled)
        if sched_min is not None:
            delay_to_add = delay if delay is not None else 0
            actual_min = sched_min + delay_to_add
            actual_h = actual_min // 60
            actual_m = actual_min % 60
            return f"{actual_h:02d}{actual_m:02d}"
        return None

    def is_valid(self):
        return check_group_of_properties_exist(
            self.scheduled,
            self.real,
            self.delay,
            self.status,
            self.actual,
        )

    def get_rail_departure_times(self):
        return {
            "delay": self.delay,
            "status": self.status,
            "actual": self.actual,
        }
