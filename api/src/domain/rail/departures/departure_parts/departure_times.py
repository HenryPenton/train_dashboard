from src.shared.utils.time import twenty_four_hour_string_to_minutes
from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)


class RailDepartureTimes:
    def __init__(self, location_detail: dict):
        self.scheduled_arrival = self._get_scheduled_arrival(location_detail)
        self.real_arrival = self._get_real_arrival(location_detail)
        self.scheduled_departure = self._get_scheduled_departure(location_detail)
        self.real_departure = self._get_real_departure(location_detail)

        self.actual = self._get_actual(self.real_departure, self.scheduled_departure)

        self.duration = self._get_duration(
            self.real_departure,
            self.real_arrival,
            self.scheduled_departure,
            self.scheduled_arrival,
        )

        self.delay = self._get_delay(self.scheduled_departure, self.real_departure)
        self.status = self._get_status(self.delay)

    @staticmethod
    def _get_actual(real_departure, scheduled_departure):
        return real_departure or scheduled_departure

    @staticmethod
    def _get_duration(
        real_departure, real_arrival, scheduled_departure, scheduled_arrival
    ):
        def minutes(t):
            return twenty_four_hour_string_to_minutes(t)

        # Prefer real times if both are present
        if real_departure and real_arrival:
            dep_min = minutes(real_departure)
            arr_min = minutes(real_arrival)
            if dep_min is not None and arr_min is not None:
                return arr_min - dep_min
            return None

        # Otherwise fall back to scheduled times
        dep_min = minutes(scheduled_departure)
        arr_min = minutes(scheduled_arrival)
        if dep_min is not None and arr_min is not None:
            return arr_min - dep_min
        return None

    @staticmethod
    def _get_scheduled_arrival(loc):
        return loc.get("gbttBookedArrival")

    @staticmethod
    def _get_scheduled_departure(loc):
        return loc.get("gbttBookedDeparture")

    @staticmethod
    def _get_real_arrival(loc):
        return loc.get("realtimeArrival")

    @staticmethod
    def _get_real_departure(loc):
        return loc.get("realtimeDeparture")

    @classmethod
    def _get_delay(cls, scheduled_departure: str, real_departure: str):
        sched_min = twenty_four_hour_string_to_minutes(scheduled_departure)
        real_min = twenty_four_hour_string_to_minutes(real_departure)
        if sched_min is not None:
            if real_min is not None:
                return real_min - sched_min
            return 0
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

    def is_valid(self):
        return check_group_of_properties_exist(
            self.scheduled_arrival,
            self.scheduled_departure,
            self.delay,
            self.status,
            self.duration,
        )

    def get_rail_departure_times(self):
        return {
            "delay": self.delay,
            "status": self.status,
            "actual": self.actual,
            "duration": self.duration,
        }
