import datetime


def format_best_route_markdown(best_route, from_name, to_name):
    duration = best_route.get("duration")
    arrival_raw = best_route.get("arrival")
    arrival_time = ""
    if arrival_raw:
        try:
            arrival_dt = datetime.datetime.fromisoformat(arrival_raw)
            arrival_time = arrival_dt.strftime("%H:%M")
        except Exception:
            arrival_time = arrival_raw
    legs = best_route.get("legs", [])

    lines = [
        f"# 🗺️ Best Route from {from_name} to {to_name}",
        f"**Total duration:** {duration} min",
        f"**Arrive by:** {arrival_time}",
        "",
        "## Route Details:",
    ]

    mode_emoji = {
        "national-rail": "🚆",
        "tube": "🚇",
        "tram": "🚋",
        "bus": "🚌",
        "walking": "🚶",
        "overground": "🚈",
        "dlr": "🚝",
        "river-bus": "⛴️",
        "coach": "🚌",
        "tfl-rail": "🚄",
    }

    for leg in legs:
        mode = leg.get("mode", "")
        emoji = mode_emoji.get(mode, "➡️")
        instruction = leg.get("instruction", "")
        lines.append(f"{emoji} {instruction}\n")

    return "\n".join(lines)
