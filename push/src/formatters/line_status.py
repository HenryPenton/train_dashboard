def format_line_status_markdown(line_statuses):
    if not line_statuses:
        return "No line status data found."

    lines = ["# 🚇 Tube Line Status\n"]
    for line in line_statuses:
        name = line.get("name", "Unknown Line")
        status = line.get("status", "Unknown")
        emoji = "🟢" if status.lower() == "good service" else "🔴"
        lines.append(f"{emoji} **{name}**: {status}")
    return "\n".join(lines)
