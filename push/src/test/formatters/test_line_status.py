from src.formatters.line_status import format_line_status_markdown
from src.models.models import TubeLineStatus


def test_format_line_status_markdown_basic():
    statuses = [
        TubeLineStatus(name="Central", statusList=["Good Service"], statusSeverity=1),
        TubeLineStatus(name="Piccadilly", statusList=["Severe Delays"], statusSeverity=10),
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


def test_format_line_status_markdown_multiple_statuses():
    statuses = [
        TubeLineStatus(name="Northern", statusList=["Minor Delays", "Part Closure"], statusSeverity=7),
    ]
    result = format_line_status_markdown(statuses)
    expected = (
        "# 🚇 Tube Line Status\n\n"
        "🔴 **Northern**: Minor Delays, Part Closure"
    )
    assert result == expected
