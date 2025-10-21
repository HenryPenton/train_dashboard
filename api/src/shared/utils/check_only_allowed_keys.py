def check_only_allowed_keys(items, allowed_keys):
    """
    Filters a list of dicts, keeping only those that:
    - Are dicts
    - Have all allowed_keys present as strings
    Returns a list of dicts with only allowed_keys as string values.
    """
    # If items is not a list, return empty list (invalid input)
    if not isinstance(items, list):
        return []

    filtered = []  # Will hold the filtered dicts
    for item in items:
        # Only process items that are dicts
        if not isinstance(item, dict):
            continue

        # Build a new dict with only allowed keys and string values
        filtered_item = {
            k: v for k, v in item.items() if k in allowed_keys and isinstance(v, str)
        }

        # Only include dicts that have all allowed keys present as strings
        if all(k in filtered_item for k in allowed_keys):
            filtered.append(filtered_item)

    # Return the list of filtered dicts
    return filtered
