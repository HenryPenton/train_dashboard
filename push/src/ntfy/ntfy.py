import logging
import os
from python_ntfy import NtfyClient

logger = logging.getLogger(__name__)


def send_ntfy_notification(topic, message):
    server = os.environ.get("NTFY_SERVER", None)
    logger.debug(f"Sending to topic '{topic}' ({len(message)} chars)")

    try:
        if server is not None:
            client = NtfyClient(topic=topic, server=server)
        else:
            client = NtfyClient(topic=topic)

        client.send(message, format_as_markdown=True)
        logger.info(f"Successfully sent notification to topic '{topic}'")

    except Exception as e:
        logger.error(f"Failed to send notification to topic '{topic}': {str(e)}")
        truncated_msg = message[:200] + "..." if len(message) > 200 else message
        logger.debug(f"Message that failed to send: {truncated_msg}")
        raise
