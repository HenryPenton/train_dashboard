from collections import Counter


def summarise_best_route(best):
    """
    Summarise the best journey returned by the TFL Journey Planner API.
    Args:
        best (dict): The best journey object from the TFL API.
    Returns:
        dict: Summary with duration, arrival, and legs info.
    """
    return {
        "duration": best.get("duration"),
        "arrival": best.get("arrivalDateTime"),
        "legs": [
            {
                "mode": leg.get("mode", {}).get("name"),
                "instruction": leg.get("instruction", {}).get("summary"),
                "departure": leg.get("departurePoint", {}).get("commonName"),
                "arrival": leg.get("arrivalPoint", {}).get("commonName"),
                "line": leg.get("routeOptions", [{}])[0].get("name"),
            }
            for leg in best.get("legs", [])
        ],
    }


def simplify_tfl_line_status(response_json):
    """
    Simplify the TFL line status response to an array of objects with line name and concatenated status severity descriptions.
    If a status appears multiple times, format as 'status xN'.
    Args:
        response_json (list): The JSON response from the TFL API (list of lines).
    Returns:
        list: List of dicts with 'name' and 'status' keys.
    """
    simplified = []
    for line in response_json:
        name = line.get("name")
        statuses = line.get("lineStatuses", [])
        if statuses:
            status_list = [
                s.get("statusSeverityDescription")
                for s in statuses
                if s.get("statusSeverityDescription")
            ]
            counts = Counter(status_list)
            status_parts = []
            for status, count in counts.items():
                if count > 1:
                    status_parts.append(f"{status} x{count}")
                else:
                    status_parts.append(status)
            status_str = ", ".join(status_parts)
            simplified.append({"name": name, "status": status_str})
    return simplified
