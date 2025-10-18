from collections import Counter


class LineStatus:
    def __init__(self, response_json: list):
        self.simplified = self._simplify(response_json)

    @staticmethod
    def _simplify(response_json):
        simplified = []
        for line in response_json:
            name = line.get("name")
            statuses = line.get("lineStatuses", [])
            if statuses:
                status_list = [
                    s.get("statusSeverityDescription")
                    for s in statuses
                    if s.get("statusSeverityDescription")
                ]
                counts = Counter(status_list)
                status_parts = []
                for status, count in counts.items():
                    if count > 1:
                        status_parts.append(f"{status} x{count}")
                    else:
                        status_parts.append(status)
                status_str = ", ".join(status_parts)
                simplified.append({"name": name, "status": status_str})
        return simplified

    def as_list(self):
        return self.simplified
