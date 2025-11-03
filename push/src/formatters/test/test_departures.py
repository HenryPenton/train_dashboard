from src.formatters.departures import format_departures_markdown


def test_format_departures_markdown_basic():
    departures = [
        {
            "origin": "A",
            "destination": "B",
            "status": "On time",
            "platform": "1",
            "actual": "12:00",
            "delay": 0,
        },
        {
            "origin": "A",
            "destination": "C",
            "status": "Late",
            "platform": "2",
            "actual": "12:10",
            "delay": 5,
        },
    ]
    result = format_departures_markdown(departures, "A", "B/C")
    expected = (
        "# 🚆 Upcoming Departures from A to B/C\n\n"
        "🟢 **A** -> **B** is **On time** and departs from platform **1** at **12:00**\n\n"
        "🔴 **A** -> **C** is **Late (5 mins)** and departs from platform **2** at **12:10**\n"
    )
    assert result == expected


def test_format_departures_markdown_empty():
    result = format_departures_markdown([], "A", "B")
    assert result == "No departures found."
