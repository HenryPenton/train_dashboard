def twenty_four_hour_string_to_minutes(t: str):
    if not t:
        return None
    if len(t) in (4, 6):
        return int(t[:2]) * 60 + int(t[2:4])
    return None
