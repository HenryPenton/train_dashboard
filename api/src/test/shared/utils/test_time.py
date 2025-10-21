from src.shared.utils.time import twenty_four_hour_string_to_minutes


class TestTwentyFourHourStringToMinutes:
    def test_none_or_empty(self):
        assert twenty_four_hour_string_to_minutes("") is None
        assert twenty_four_hour_string_to_minutes(None) is None

    def test_valid_4_or_6_length(self):
        assert twenty_four_hour_string_to_minutes("0930") == 570
        assert twenty_four_hour_string_to_minutes("2359") == 1439
        assert (
            twenty_four_hour_string_to_minutes("093012") == 570
        )  # Only first 4 chars used

    def test_invalid_length(self):
        assert twenty_four_hour_string_to_minutes("930") is None
        assert twenty_four_hour_string_to_minutes("093") is None
        assert twenty_four_hour_string_to_minutes("09301") is None
