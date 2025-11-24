from typing import List

from src.models.models import TubeLineStatus


def format_line_status_markdown(line_statuses: List[TubeLineStatus]):
    if not line_statuses:
        return "No line status data found."

    lines = ["# 🚇 Tube Line Status\n"]
    for line in line_statuses:
        name = line.name
        status_list = line.statusList

        status = status_list[0] if status_list else "Unknown"
        if len(status_list) > 1:
            status = ", ".join(status_list)

        emoji = "🟢" if status.lower() == "good service" else "🔴"
        lines.append(f"{emoji} **{name}**: {status}")
    return "\n".join(lines)
