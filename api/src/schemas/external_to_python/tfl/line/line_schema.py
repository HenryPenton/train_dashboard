from marshmallow import Schema, fields, EXCLUDE


class LineStatusSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    statusSeverity = fields.Int(required=True)
    statusSeverityDescription = fields.Str(required=True)


class LineRecordSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Str(required=True)
    name = fields.Str(required=True)
    lineStatuses = fields.List(fields.Nested(LineStatusSchema), required=True)
