from marshmallow import Schema, fields, missing


class ModeSchema(Schema):
    name = fields.Str(allow_none=False, required=True)


class InstructionSchema(Schema):
    summary = fields.Str(allow_none=False, required=True)


class PointSchema(Schema):
    commonName = fields.Str(allow_none=False, required=True)


class RouteOptionSchema(Schema):
    name = fields.Str(allow_none=False, required=True)


class LegSchema(Schema):
    mode = fields.Nested(ModeSchema, allow_none=False, required=True)
    instruction = fields.Nested(InstructionSchema, allow_none=False, required=True)
    departurePoint = fields.Nested(PointSchema, allow_none=False, required=True)
    arrivalPoint = fields.Nested(PointSchema, allow_none=False, required=True)
    routeOptions = fields.List(
        fields.Nested(RouteOptionSchema), allow_none=False, required=True
    )


class FareSchema(Schema):
    totalCost = fields.Int(allow_none=True, dump_default=missing)


class JourneyRecordSchema(Schema):
    legs = fields.List(fields.Nested(LegSchema), load_default=list, allow_none=False)
    duration = fields.Int(allow_none=False)
    arrivalDateTime = fields.Str(allow_none=False)
    fare = fields.Nested(
        FareSchema, allow_none=True, load_default=None, dump_default=missing
    )
