from python_ntfy import NtfyClient


def send_ntfy_notification(topic, message):
    print(f"Sending notification to topic {topic}: {message}")
    client = NtfyClient(topic=topic)
    client.send(message, format_as_markdown=True)
