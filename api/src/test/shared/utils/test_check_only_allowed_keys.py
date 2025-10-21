from src.shared.utils.check_only_allowed_keys import check_only_allowed_keys


def test_check_only_allowed_keys_happy_path():
    allowed_keys = ["foo", "bar"]
    items = [
        {"foo": "a", "bar": "b", "baz": "c"},
        {"foo": "x", "bar": "y"},
    ]
    result = check_only_allowed_keys(items, allowed_keys)
    assert result == [
        {"foo": "a", "bar": "b"},
        {"foo": "x", "bar": "y"},
    ]


def test_check_only_allowed_keys_unhappy_path():
    allowed_keys = ["foo", "bar"]
    items = [
        {"foo": "a"},  # missing 'bar'
        {"foo": "x", "bar": 123},  # 'bar' not a string
        ["notadict"],  # not a dict
        "notadict",  # not a dict
        {"foo": "a", "bar": "b"},  # valid
    ]
    result = check_only_allowed_keys(items, allowed_keys)
    assert result == [{"foo": "a", "bar": "b"}]
