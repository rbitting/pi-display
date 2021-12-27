from util_logging import set_logging_config
from util_server import send_status
import logging

set_logging_config()

logging.info('********* Forcing status clear *********')
send_status(True, False, "Forced status clear.")
