from unittest.mock import patch, MagicMock
from src.ntfy.ntfy import send_ntfy_notification


def test_send_ntfy_notification():
    topic = "test_topic"
    message = "Hello, world!"
    with patch("src.ntfy.ntfy.NtfyClient") as MockNtfyClient:
        mock_client = MagicMock()
        MockNtfyClient.return_value = mock_client
        send_ntfy_notification(topic, message)
        MockNtfyClient.assert_called_once_with(topic=topic)
        mock_client.send.assert_called_once_with(message, format_as_markdown=True)
