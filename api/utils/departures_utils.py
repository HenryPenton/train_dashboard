# departures_utils.py

def process_departures_response(response_json, destination_tiploc=None):
    """
    Process and filter the departures response JSON from the Real Time Trains API.
    If destination_tiploc is provided, only return departures with a destination matching that tiploc.
    Returns a simplified list of dicts with origin, destination, scheduled, platform, and delay.
    """
    services = response_json.get('services', [])
    simplified = []
    for dep in services:
        destinations = dep.get("locationDetail", {}).get("destination", [])
        match = False
        for dest in destinations:
            if not destination_tiploc or dest.get("tiploc") == destination_tiploc:
                match = True
                break
        if not match:
            continue
        loc = dep.get("locationDetail", {})
        origin = ", ".join([o.get("description", "") for o in loc.get("origin", [])])
        destination = ", ".join([d.get("description", "") for d in loc.get("destination", [])])
        scheduled = loc.get("gbttBookedDeparture")
        platform = loc.get("platform")
        real = loc.get("realtimeDeparture")
        delay = None
        actual = None
        if scheduled:
            def parse_time(t):
                if len(t) == 4:
                    return int(t[:2]) * 60 + int(t[2:4])
                if len(t) == 6:
                    return int(t[:2]) * 60 + int(t[2:4])
                return None
            sched_min = parse_time(scheduled)
            real_min = parse_time(real) if real else None
            if sched_min is not None and real_min is not None:
                delay = real_min - sched_min
            # Calculate actual as scheduled + delay (if delay is not None)
            if sched_min is not None:
                actual_min = sched_min + (delay if delay is not None else 0)
                # Format back to HHMM string
                actual_h = actual_min // 60
                actual_m = actual_min % 60
                actual = f"{actual_h:02d}{actual_m:02d}"
        simplified.append({
            "origin": origin,
            "destination": destination,
            "scheduled": scheduled,
            "platform": platform,
            "delay": delay,
            "actual": actual
        })
    return simplified
