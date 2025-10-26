from marshmallow import Schema, fields, missing, EXCLUDE


class ModeSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(allow_none=False, required=True)


class InstructionSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    summary = fields.Str(allow_none=False, required=True)


class PointSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    commonName = fields.Str(allow_none=False, required=True)


class RouteOptionSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(allow_none=False, required=True)


class LegSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    mode = fields.Nested(ModeSchema, required=True)
    instruction = fields.Nested(InstructionSchema, required=True)
    departurePoint = fields.Nested(PointSchema, required=True)
    arrivalPoint = fields.Nested(PointSchema, required=True)
    routeOptions = fields.List(fields.Nested(RouteOptionSchema), required=True)


class FareSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    totalCost = fields.Int(allow_none=True, load_default=missing)


class JourneyRecordSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    legs = fields.List(fields.Nested(LegSchema), load_default=list, allow_none=False)
    duration = fields.Int(allow_none=False)
    arrivalDateTime = fields.Str(allow_none=False)
    fare = fields.Nested(FareSchema, allow_none=True, load_default=missing)
