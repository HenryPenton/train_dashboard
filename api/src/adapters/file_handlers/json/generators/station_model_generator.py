from src.DAOs.station.station_dao import StationDAO


def naptan_postprocess(data):
    if isinstance(data, dict):
        # If data is a dict of dicts, get the values
        data = list(data.values())
    return [StationDAO(**item) for item in data]
