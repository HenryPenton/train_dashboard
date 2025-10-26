class LineRecord:
    def __init__(self, line: dict):
        self.id = line.get("id")
        self.name = line.get("name")
        self.line_statuses = line.get("lineStatuses", [])
