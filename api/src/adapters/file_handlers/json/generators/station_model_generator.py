from src.models.external_to_python.station.station_model import StationModel


def naptan_postprocess(data):
    if isinstance(data, dict):
        # If data is a dict of dicts, get the values
        data = list(data.values())
    return [StationModel(**item) for item in data]
