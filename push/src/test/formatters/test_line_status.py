from src.formatters.line_status import format_line_status_markdown
from src.models.models import StatusItem, TubeLineStatus


def test_format_line_status_markdown_basic():
    statuses = [
        TubeLineStatus(name="Central", statuses=[StatusItem(status="Good Service")], statusSeverity=10),
        TubeLineStatus(name="Piccadilly", statuses=[StatusItem(status="Severe Delays")], statusSeverity=1),
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
        TubeLineStatus(name="Northern", statuses=[StatusItem(status="Minor Delays"), StatusItem(status="Part Closure")], statusSeverity=7),
    ]
    result = format_line_status_markdown(statuses)
    expected = (
        "# 🚇 Tube Line Status\n\n"
        "🔴 **Northern**: Minor Delays, Part Closure"
    )
    assert result == expected
