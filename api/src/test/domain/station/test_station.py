from src.domain.station.station import Station


def test_station_fields():
    s = Station(naptanID="123", CommonName="Test Station")
    assert s.naptanID == "123"
    assert s.CommonName == "Test Station"
