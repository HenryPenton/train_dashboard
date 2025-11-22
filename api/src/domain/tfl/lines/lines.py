from typing import List
from src.DAOs.tfl.line_dao import LineDAO, LineStatusDAO


class LineStatusModel:
    def __init__(self, line: LineDAO, logger):
        self.logger = logger
        self.statusList = self._get_status_list(line)
        self.name = self._get_name(line)
        self.statusSeverity = self._get_status_severity(line)
        self.logger.debug(
            f"LineStatusModel created for {self.name}: status={self.statusList}, severity={self.statusSeverity}"
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
    def _get_status_list(line: List[LineStatusDAO]) -> list[str]:
        line_statuses = line.line_statuses
        if line_statuses:
            status_list = []
            for s in line_statuses:
                status_list.append(s.statusSeverityDescription)
                print(s)

            return list(set(status_list))
        return []

    def as_dict(self) -> dict:
        self.logger.debug(f"Converting LineStatusModel for {self.name} to dict")
        return {
            "name": self.name,
            "statusList": self.statusList,
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
