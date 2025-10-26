from marshmallow import EXCLUDE, Schema, fields, missing, post_load


class LocationSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    description = fields.Str(required=True)


class DepartureRecordSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    origin = fields.List(fields.Nested(LocationSchema), required=True)
    destination = fields.List(fields.Nested(LocationSchema), required=True)
    gbttBookedDeparture = fields.Str(required=True)
    realtimeDeparture = fields.Str(
        allow_none=True,
        required=False,
        load_default=missing,
    )
    platform = fields.Str(
        allow_none=True,
        load_default=None,
    )

    @post_load
    def set_platform_questionmark(self, data, **kwargs):
        if data.get("platform") is None:
            data["platform"] = "?"
        return data
