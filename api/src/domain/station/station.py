

class Station:
    @classmethod
    def sort_by_name(cls, stations):
        return sorted(stations, key=lambda x: x.commonName.lower())
