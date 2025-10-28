def check_group_of_properties_exist(*args):
    return not any(arg is None for arg in args)
