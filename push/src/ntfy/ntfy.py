import os
from python_ntfy import NtfyClient


def send_ntfy_notification(topic, message):
    server = os.environ.get("NTFY_SERVER", None)
    client = None
    if server is not None:
        client = NtfyClient(topic=topic, server=server)
    else:
        client = NtfyClient(topic=topic)

    client.send(message, format_as_markdown=True)
