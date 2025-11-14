def format_departures_markdown(departures, from_station_name, to_station_name):
    if not departures:
        return "No departures found."

    lines = [
        f"# 🚆 Upcoming Departures from {from_station_name} to {to_station_name}",
        "",
    ]
    for dep in departures[:10]:
        formatted_status = ""
        delay_time = dep.get("delay", 0)
        status = dep.get("status", "").lower()
        minsmin = "mins" if delay_time != 1 else "min"
        
        if status == "cancelled":
            emoji = "⚫"
            formatted_status = f"**{dep.get('status', '')}**"
        elif status in ["late", "delayed"]:
            emoji = "🔴"
            formatted_status = f"**{dep.get('status', '')} ({delay_time} {minsmin})**"
        else:
            formatted_status = f"**{dep.get('status', '')}**"
            emoji = "🟢"

        if status == "cancelled":
            lines.append(
                f"{emoji} **{dep.get('origin', '')}** -> **{dep.get('destination', '')}** is {formatted_status}\n"
            )
        else:
            lines.append(
                f"{emoji} **{dep.get('origin', '')}** -> **{dep.get('destination', '')}** is {formatted_status} "
                f"and departs from platform **{dep.get('platform', '')}** at **{dep.get('actual', '')}**\n"
            )
    return "\n".join(lines)
