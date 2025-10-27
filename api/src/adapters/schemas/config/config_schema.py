from marshmallow import EXCLUDE, Schema, fields, post_load


class TubeRouteSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    origin = fields.Str(required=True)
    originNaPTANOrATCO = fields.Str(required=True)
    destination = fields.Str(required=True)
    destinationNaPTANOrATCO = fields.Str(required=True)


class RailDepartureSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    origin = fields.Str(required=True)
    originCode = fields.Str(required=True)
    destination = fields.Str(required=True)
    destinationCode = fields.Str(required=True)


class ConfigSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    tfl_best_routes = fields.List(fields.Nested(TubeRouteSchema), load_default=[])
    rail_departures = fields.List(fields.Nested(RailDepartureSchema), load_default=[])
    show_tfl_lines = fields.Bool(load_default=False)
    refresh_timer = fields.Int(load_default=60)

    @post_load
    def set_defaults(self, data, **kwargs):
        # Ensure lists are present even if missing
        data.setdefault("tfl_best_routes", [])
        data.setdefault("rail_departures", [])
        data["show_tfl_lines"] = bool(data.get("show_tfl_lines", False))
        data["refresh_timer"] = int(data.get("refresh_timer", 60))
        return data
