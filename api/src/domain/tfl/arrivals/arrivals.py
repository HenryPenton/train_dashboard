class ArrivalModel:
    def __init__(self, arrival_dao):
        self.id = arrival_dao.id
        self.line_id = arrival_dao.lineId
        self.line_name = arrival_dao.lineName
        self.platform_name = arrival_dao.platformName
        self.time_to_station_seconds = arrival_dao.timeToStation
        self.expected_arrival = arrival_dao.expectedArrival
        self.towards = arrival_dao.towards
        self.current_location = arrival_dao.currentLocation
        self.destination_name = arrival_dao.destinationName
        self.direction = arrival_dao.direction

    def as_dict(self):
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
    def __init__(self, arrival_daos, logger):
        self.logger = logger
        self.arrivals = [ArrivalModel(dao) for dao in arrival_daos]

    def get_arrivals_by_line(self):
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
