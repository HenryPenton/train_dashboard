import logging
from src.shared.logging.logger_utils import get_logger


def test_get_logger():
    logger_name = "test_get_logger"
    retrieved_logger = get_logger(logger_name)
    assert isinstance(retrieved_logger, logging.Logger)
    assert retrieved_logger.name == logger_name
