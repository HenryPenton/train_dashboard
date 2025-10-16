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
    Simplify the TFL line status response to an array of objects with line name and status severity description.
    Args:
        response_json (list): The JSON response from the TFL API (list of lines).
    Returns:
        list: List of dicts with 'name' and 'status' keys.
    """
    simplified = []
    for line in response_json:
        name = line.get("name")
        status = None
        statuses = line.get("lineStatuses", [])
        if statuses:
            status = statuses[0].get("statusSeverityDescription")
            simplified.append({"name": name, "status": status})
    return simplified
