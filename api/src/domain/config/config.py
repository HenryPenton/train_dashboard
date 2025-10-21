from src.shared.utils.check_only_allowed_keys import check_only_allowed_keys


class Config:
    @staticmethod
    def process_config(config):
        """
        Ensure 'tfl_best_routes' and 'rail_departures' arrays are present and are lists.
        Ensure 'show_tfl_lines' is present and is a boolean, defaulting to False if missing.
        Remove any keys not in allowed_keys.
        """
        allowed_keys = {"tfl_best_routes", "rail_departures", "show_tfl_lines"}
        keys_to_remove = [k for k in config.keys() if k not in allowed_keys]
        for k in keys_to_remove:
            config.pop(k)
        config["tfl_best_routes"] = Config._get_tfl_best_routes(config)
        config["rail_departures"] = Config._get_rail_departures(config)
        config["show_tfl_lines"] = Config._get_show_tfl_lines(config)
        return config

    @staticmethod
    def _get_tfl_best_routes(config):
        value = config.get("tfl_best_routes")
        allowed_keys = {"origin", "originNaptan", "destination", "destinationNaptan"}
        return check_only_allowed_keys(value, allowed_keys)

    @staticmethod
    def _get_rail_departures(config):
        value = config.get("rail_departures")
        allowed_keys = {"origin", "originCode", "destination", "destinationCode"}
        return check_only_allowed_keys(value, allowed_keys)

    @staticmethod
    def _get_show_tfl_lines(config):
        value = config.get("show_tfl_lines")
        return value if isinstance(value, bool) else False
