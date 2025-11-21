from typing import List

from src.models.models import RailDeparture


def format_departures_markdown(
    departures: List[RailDeparture], from_station_name, to_station_name
):
    if not departures:
        return "No departures found."

    lines = [
        f"# 🚆 Upcoming Departures from {from_station_name} to {to_station_name}",
        "",
    ]
    for dep in departures[:10]:
        formatted_status = ""
        delay_time = dep.delay
        status = dep.status.lower()
        minsmin = "mins" if delay_time != 1 else "min"

        if status == "cancelled":
            emoji = "⚫"
            formatted_status = f"**{dep.status}**"
        elif status in ["late", "delayed"]:
            emoji = "🔴"
            formatted_status = f"**{dep.status} ({delay_time} {minsmin})**"
        else:
            formatted_status = f"**{dep.status}**"
            emoji = "🟢"

        if status == "cancelled":
            lines.append(
                f"{emoji} **{dep.origin}** -> **{dep.destination}** is {formatted_status}\n"
            )
        else:
            lines.append(
                f"{emoji} **{dep.origin}** -> **{dep.destination}** is {formatted_status} "
                f"and departs from platform **{dep.platform}** at **{dep.actual}**\n"
            )
    return "\n".join(lines)
