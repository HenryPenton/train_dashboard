from collections import Counter

from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)

from src.models.external_to_python.tfl.line.line_model import LineModel


class LineStatus:
    def __init__(self, line: LineModel) -> None:
        self.status = self._get_status(line)
        self.name = self._get_name(line)
        self.statusSeverity = self._get_status_severity(line)

    @staticmethod
    def _get_name(line) -> str | None:
        return line.name

    @staticmethod
    def _get_status_severity(line) -> int | None:
        line_statuses = line.line_statuses
        if line_statuses:
            return min(
                (s.statusSeverity for s in line_statuses if s.statusSeverity),
                default=None,
            )

    @staticmethod
    def _get_status(line) -> str | None:
        line_statuses = line.line_statuses
        if line_statuses:
            status_list = [
                s.statusSeverityDescription
                for s in line_statuses
                if s.statusSeverityDescription
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
    def __init__(self, lines: list[LineModel]):
        self.line_statuses = self._extract_statuses(lines)

    @staticmethod
    def _extract_statuses(lines: list[LineModel]) -> list[dict]:
        lines_statuses: list[dict] = []
        for line in lines:
            line_status_dict = LineStatus(line).get_status()

            if line_status_dict:
                lines_statuses.append(line_status_dict)

        return lines_statuses

    def get_line_statuses(self) -> list[dict]:
        return self.line_statuses
