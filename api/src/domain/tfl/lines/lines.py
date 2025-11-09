from collections import Counter

from src.DAOs.tfl.line_dao import LineDAO


class LineStatusModel:
    def __init__(self, line: LineDAO, logger):
        self.logger = logger
        self.status = self._get_status(line)
        self.name = self._get_name(line)
        self.statusSeverity = self._get_status_severity(line)
        self.logger.debug(
            f"LineStatusModel created for {self.name}: status={self.status}, severity={self.statusSeverity}"
        )

    @staticmethod
    def _get_name(line) -> str:
        return line.name

    @staticmethod
    def _get_status_severity(line) -> int:
        line_statuses = line.line_statuses
        if line_statuses:
            return min(
                (s.statusSeverity for s in line_statuses if s.statusSeverity),
            )

    @staticmethod
    def _get_status(line) -> str:
        line_statuses = line.line_statuses
        if line_statuses:
            status_list = [s.statusSeverityDescription for s in line_statuses]
            counts = Counter(status_list)
            status_parts = []
            for status, count in counts.items():
                if count > 1:
                    status_parts.append(f"{status} x{count}")
                else:
                    status_parts.append(status)
            status_str = ", ".join(status_parts)
            return status_str

    def as_dict(self) -> dict:
        self.logger.debug(f"Converting LineStatusModel for {self.name} to dict")
        return {
            "name": self.name,
            "status": self.status,
            "statusSeverity": self.statusSeverity,
        }


class LineStatusModelList:
    def __init__(self, lines: list[LineDAO], logger):
        self.logger = logger
        self.line_statuses = self._extract_statuses(lines)

    def _extract_statuses(self, lines: list[LineDAO]) -> list[LineStatusModel]:
        lines_status_models: list[LineStatusModel] = []
        for line in lines:
            lines_status_models.append(LineStatusModel(line, logger=self.logger))
        self.logger.debug(
            f"_extract_statuses created {len(lines_status_models)} LineStatusModels"
        )
        return lines_status_models

    def get_line_statuses(self) -> list[LineStatusModel]:
        self.logger.info(f"Returning {len(self.line_statuses)} line statuses")
        return self.line_statuses
