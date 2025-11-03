from src.formatters.best_route import format_best_route_markdown


def test_format_best_route_markdown_basic():
    best_route = {
        "duration": 45,
        "arrival": "2025-11-03T15:30:00",
        "legs": [
            {"mode": "national-rail", "instruction": "Take the train from A to B"},
            {"mode": "tube", "instruction": "Change to the tube at B"},
        ],
    }
    result = format_best_route_markdown(best_route, "A", "C")
    expected = (
        "# 🗺️ Best Route from A to C\n"
        "**Total duration:** 45 min\n"
        "**Arrive by:** 15:30\n"
        "\n"
        "## Route Details:\n"
        "🚆 Take the train from A to B\n\n"
        "🚇 Change to the tube at B\n"
    )
    assert result == expected


def test_format_best_route_markdown_no_arrival():
    best_route = {"duration": 10, "legs": []}
    result = format_best_route_markdown(best_route, "X", "Y")
    expected = (
        "# 🗺️ Best Route from X to Y\n"
        "**Total duration:** 10 min\n"
        "**Arrive by:** \n"
        "\n"
        "## Route Details:"
    )
    assert result == expected
