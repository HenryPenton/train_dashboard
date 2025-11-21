from src.formatters.line_status import format_line_status_markdown
from src.models.models import TubeLineStatus


def test_format_line_status_markdown_basic():
    statuses = [
        TubeLineStatus(name="Central", status="Good Service"),
        TubeLineStatus(name="Piccadilly", status="Severe Delays"),
    ]
    result = format_line_status_markdown(statuses)
    expected = (
        "# 🚇 Tube Line Status\n\n"
        "🟢 **Central**: Good Service\n"
        "🔴 **Piccadilly**: Severe Delays"
    )
    assert result == expected


def test_format_line_status_markdown_empty():
    result = format_line_status_markdown([])
    assert result == "No line status data found."
