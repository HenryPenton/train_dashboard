def check_group_of_properties_exist(*args):
    """
    Returns True if none of the provided arguments are None, otherwise False.
    Usage: check_group_of_properties_exist(a, b, c)
    """
    return not any(arg is None for arg in args)
