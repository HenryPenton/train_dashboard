from logging import Logger
from typing import Any, Dict, List

from src.DAOs.tfl.arrival_dao import ArrivalDAO


class ArrivalModel:
    """
    Model representing a single TfL arrival with transformed and user-friendly data.

    Transforms raw arrival data from the TfL API into a more usable format,
    including platform name transformations for better user experience.
    """

    def __init__(self, arrival_dao: ArrivalDAO) -> None:
        """
        Initialize an ArrivalModel from a TfL arrival data access object.

        Args:
            arrival_dao: Raw arrival data object from TfL API containing
                        arrival information like platform, timing, and destination details.
        """
        self.id = arrival_dao.id
        self.line_id = arrival_dao.lineId
        self.line_name = arrival_dao.lineName
        self.platform_name = self._transform_platform_name(arrival_dao.platformName)
        self.time_to_station_seconds = arrival_dao.timeToStation
        self.expected_arrival = arrival_dao.expectedArrival
        self.towards = arrival_dao.towards
        self.current_location = arrival_dao.currentLocation
        self.destination_name = arrival_dao.destinationName
        self.direction = arrival_dao.direction

    def _transform_platform_name(self, platform_name: str) -> str:
        """
        Transform platform names to be more user-friendly and readable.

        Converts technical TfL platform terminology into more intuitive language:
        - "inner rail" becomes "Anti-Clockwise"
        - "outer rail" becomes "Clockwise"
        - Capitalizes each word for proper formatting

        Args:
            platform_name (str): Original platform name from TfL API

        Returns:
            str: Transformed platform name with user-friendly terminology and proper capitalization
        """
        replacements = {"inner rail": "anti-clockwise", "outer rail": "clockwise"}
        result = platform_name.lower()

        for old, new in replacements.items():
            result = result.replace(old, new)

        return result.title()

    def as_dict(self) -> Dict[str, Any]:
        """
        Convert the ArrivalModel instance to a dictionary representation.

        Creates a JSON-serializable dictionary containing all arrival information
        with camelCase keys for frontend consumption.

        Returns:
            Dict[str, Any]: Dictionary containing all arrival properties with camelCase keys
        """
        return {
            "id": self.id,
            "lineId": self.line_id,
            "lineName": self.line_name,
            "platformName": self.platform_name,
            "timeToStation": self.time_to_station_seconds,
            "expectedArrival": self.expected_arrival,
            "towards": self.towards,
            "currentLocation": self.current_location,
            "destinationName": self.destination_name,
            "direction": self.direction,
        }


class ArrivalsList:
    """
    Container class for managing and organizing multiple TfL arrivals.

    Processes a collection of arrival data and provides methods to organize
    arrivals by transport lines and platforms for structured API responses.
    """

    def __init__(self, arrival_daos: List[ArrivalDAO], logger: Logger) -> None:
        """
        Initialize ArrivalsList with raw arrival data and logging capability.

        Args:
            arrival_daos (List[ArrivalDAO]): List of raw arrival data access objects from TfL API
            logger: Logger instance for recording processing information and errors
        """
        self.logger = logger
        self.arrivals = [ArrivalModel(dao) for dao in arrival_daos]

    def get_arrivals_by_line(self) -> Dict[str, Dict[str, Dict[str, Any]]]:
        """
        Organize arrivals by transport line and platform for structured display.

        Groups all arrivals by their transport line (e.g., Central, Piccadilly),
        then sub-groups by platform within each line. Arrivals within each
        platform are sorted by time to station (soonest first).

        Returns:
            Dict[str, Dict[str, Dict[str, Any]]]: Nested structure with format:
                {
                    "lines": {
                        "line_id": {
                            "lineName": "Line Display Name",
                            "arrivals": {
                                "Platform Name": [list of arrival dicts sorted by time]
                            }
                        }
                    }
                }
        """
        lines = {}
        for arrival in self.arrivals:
            line_id = arrival.line_id
            platform_name = arrival.platform_name

            if line_id not in lines:
                lines[line_id] = {"lineName": arrival.line_name, "arrivals": {}}

            if platform_name not in lines[line_id]["arrivals"]:
                lines[line_id]["arrivals"][platform_name] = []

            lines[line_id]["arrivals"][platform_name].append(arrival.as_dict())

        # Sort each platform's arrivals by time to station
        for line_id in lines:
            for platform_name in lines[line_id]["arrivals"]:
                lines[line_id]["arrivals"][platform_name].sort(
                    key=lambda x: x["timeToStation"]
                )

        return {"lines": lines}
