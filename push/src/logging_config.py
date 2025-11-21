import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logging():
    """Configure logging with rotation and immediate flushing."""
    # Get log level from environment
    log_level_str = os.environ.get("PUSH_LOG_LEVEL", "INFO").upper()
    log_level = getattr(logging, log_level_str, logging.INFO)

    # Log rotation settings
    max_log_size = 10 * 1024 * 1024  # 10MB
    backup_count = 1

    # Ensure log directory exists
    log_dir = "./push-server-logs"
    os.makedirs(log_dir, exist_ok=True)

    # Create file handler with rotation
    file_handler = RotatingFileHandler(
        f"{log_dir}/push_service.log", maxBytes=max_log_size, backupCount=backup_count
    )

    # Override emit to flush immediately
    original_emit = file_handler.emit
    file_handler.emit = lambda record: (original_emit(record), file_handler.flush())[1]

    # Configure logging
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[file_handler, logging.StreamHandler()],
        force=True,
    )

    return log_level_str, max_log_size, backup_count
