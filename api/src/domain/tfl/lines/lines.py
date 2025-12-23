from typing import List, Optional

from src.DAOs.tfl.line_dao import LineDAO


class StatusItem:
    """Represents a single status with its optional reason."""

    def __init__(self, status: str, reason: Optional[str] = None):
        self.status = status
        self.reason = reason

    def as_dict(self) -> dict:
        return {
            "status": self.status,
            "reason": self.reason,
        }


class LineStatusModel:
    def __init__(self, line: LineDAO, logger):
        self.logger = logger
        self.statuses = self._get_statuses(line)
        self.name = self._get_name(line)
        self.statusSeverity = self._get_status_severity(line)
        self.logger.debug(
            f"LineStatusModel created for {self.name}: statuses={
                [s.as_dict() for s in self.statuses]
            }, severity={self.statusSeverity}"
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
    def _get_statuses(line: LineDAO) -> List[StatusItem]:
        """Extract unique statuses with their reasons from line statuses."""
        line_statuses = line.line_statuses
        if line_statuses:
            # Use dict to dedupe by status description while keeping first reason
            seen_statuses = {}
            for s in line_statuses:
                status_desc = s.statusSeverityDescription
                if status_desc not in seen_statuses:
                    seen_statuses[status_desc] = StatusItem(status_desc, s.reason)
            return list(seen_statuses.values())
        return []

    def as_dict(self) -> dict:
        self.logger.debug(f"Converting LineStatusModel for {self.name} to dict")
        return {
            "name": self.name,
            "statuses": [s.as_dict() for s in self.statuses],
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
