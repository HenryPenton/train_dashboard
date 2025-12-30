from typing import List

from src.models.models import TubeLineStatus


def format_line_status_markdown(line_statuses: List[TubeLineStatus]):
    if not line_statuses:
        return "No line status data found."

    lines = ["# 🚇 Tube Line Status\n"]
    for line in line_statuses:
        name = line.name
        status_items = line.statuses

        status_texts = [s.status for s in status_items] if status_items else ["Unknown"]
        status = ", ".join(status_texts)

        emoji = "🟢" if status.lower() == "good service" else "🔴"
        lines.append(f"{emoji} **{name}**: {status}")
    return "\n".join(lines)
