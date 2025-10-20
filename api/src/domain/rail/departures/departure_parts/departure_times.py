from src.adapters.clients.rttclient import DepartureRecord
from src.shared.utils.time import twenty_four_hour_string_to_minutes
from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)


class RailDepartureTimes:
    def __init__(self, service: DepartureRecord):
        self.scheduled_departure = self._get_scheduled_departure(service)
        self.real_departure = self._get_real_departure(service)

        self.actual = self.real_departure or self.scheduled_departure

        self.delay = self._get_delay(self.scheduled_departure, self.real_departure)
        self.delay = self._adjust_delay_for_overnight(
            self.delay, self.scheduled_departure, self.real_departure
        )
        self.status = self._get_status(self.delay)

    @staticmethod
    def _get_scheduled_departure(service: DepartureRecord):
        return service.scheduled_departure

    @staticmethod
    def _get_real_departure(service: DepartureRecord):
        return service.real_departure

    @staticmethod
    def _adjust_delay_for_overnight(delay, booked_departure=None, real_departure=None):
        # A negative delay can represent one of two things, the train is early, or the train was late
        # and its lateness took the departure time past midnight. Here we make the possibly naive assumption
        # that a train is never more than 12 hours late or early to deal with this situation (720 minutes).
        if booked_departure and real_departure and delay < -720:
            booked_min = twenty_four_hour_string_to_minutes(booked_departure)
            real_min = twenty_four_hour_string_to_minutes(real_departure)
            before_midnight = 1440 - booked_min
            after_midnight = real_min
            delay = before_midnight + after_midnight
        return delay

    @classmethod
    def _get_delay(cls, scheduled_departure: str, real_departure: str):
        sched_min = twenty_four_hour_string_to_minutes(scheduled_departure)
        real_min = twenty_four_hour_string_to_minutes(real_departure)
        if sched_min is None:
            return None
        if real_min is not None:
            return real_min - sched_min
        return 0

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
            self.actual,
            self.delay,
            self.status,
        )

    def get_rail_departure_times(self):
        return {
            "delay": self.delay,
            "status": self.status,
            "actual": self.actual,
        }
