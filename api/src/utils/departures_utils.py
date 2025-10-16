def get_origin(loc):
    origins = loc.get("origin", [])
    return ", ".join([origin.get("description", "") for origin in origins])

def get_destination(loc):
    destinations = loc.get("destination", [])
    return ", ".join([destination.get("description", "") for destination in destinations])

def get_scheduled(loc):
    return loc.get("gbttBookedDeparture")

def get_platform(loc):
    return loc.get("platform")

def get_real(loc):
    return loc.get("realtimeDeparture")

def parse_time(t):
    if not t:
        return None
    if len(t) in (4, 6):
        return int(t[:2]) * 60 + int(t[2:4])
    return None

def get_delay(scheduled, real):
    sched_min = parse_time(scheduled)
    real_min = parse_time(real)
    if sched_min is not None and real_min is not None:
        return real_min - sched_min
    return None

def get_actual(scheduled, delay):
    sched_min = parse_time(scheduled)
    if sched_min is not None:
        actual_min = sched_min + (delay if delay is not None else 0)
        actual_h = actual_min // 60
        actual_m = actual_min % 60
        return f"{actual_h:02d}{actual_m:02d}"
    return None

def process_departures_response(response_json):
    """
    Process and filter the departures response JSON from the Real Time Trains API.
    If destination_tiploc is provided, only return departures with a destination matching that tiploc.
    Returns a simplified list of dicts with origin, destination, scheduled, platform, and delay.
    """
    services = response_json.get('services', [])
    if len(services) == 0:
        return []
    simplified = []
    for dep in services:
        loc = dep.get("locationDetail", {})
        origin = get_origin(loc)
        destination = get_destination(loc)
        scheduled = get_scheduled(loc)
        platform = get_platform(loc)
        real = get_real(loc)
        if not (origin and destination and scheduled and platform and real):
            continue
        # Skip this service if any required property is missing
        delay = get_delay(scheduled, real)
        actual = get_actual(scheduled, delay)
        simplified.append({
            "origin": origin,
            "destination": destination,
            "scheduled": scheduled,
            "platform": platform,
            "delay": delay,
            "actual": actual
        })
    return simplified
