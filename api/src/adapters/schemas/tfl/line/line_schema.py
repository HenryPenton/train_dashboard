from marshmallow import Schema, fields


class LineStatusSchema(Schema):
    statusSeverity = fields.Int(required=True)
    statusSeverityDescription = fields.Str(required=True)


class LineRecordSchema(Schema):
    id = fields.Str(required=True)
    name = fields.Str(required=True)
    lineStatuses = fields.List(fields.Nested(LineStatusSchema), required=True)
