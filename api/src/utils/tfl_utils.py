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
