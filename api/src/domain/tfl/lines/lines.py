from collections import Counter

from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)


class LineStatus:
    def __init__(self, line: dict):
        self.status = self._get_status(line)
        self.name = self._get_name(line)
        self.statusSeverity = self._get_status_severity(line)

    @staticmethod
    def _get_name(line):
        return line.get("name")

    @staticmethod
    def _get_status_severity(line):
        line_statuses = line.get("lineStatuses", [])
        if line_statuses:
            return min(
                (
                    s.get("statusSeverity")
                    for s in line_statuses
                    if s.get("statusSeverity")
                ),
                default=None,
            )

    @staticmethod
    def _get_status(line):
        line_statuses = line.get("lineStatuses", [])
        if line_statuses:
            status_list = [
                s.get("statusSeverityDescription")
                for s in line_statuses
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
            return status_str

    def get_status(self) -> dict:
        has_required_properties = check_group_of_properties_exist(
            self.name, self.status, self.statusSeverity
        )
        if has_required_properties:
            return {
                "name": self.name,
                "status": self.status,
                "statusSeverity": self.statusSeverity,
            }


class LineStatuses:
    def __init__(self, response_json: list[dict]):
        self.line_statuses = self._extract_statuses(response_json)

    @staticmethod
    def _extract_statuses(response_json: list[dict]) -> list[dict]:
        lines_statuses: list[dict] = []
        for line in response_json:
            line_status_dict = LineStatus(line).get_status()
            if line_status_dict:
                lines_statuses.append(line_status_dict)

        return lines_statuses

    def get_line_statuses(self) -> list[dict]:
        return self.line_statuses
