import logging

import epd5in83_V2
from util_dates import get_current_date_time
from util_logging import set_logging_config
from util_server import is_display_busy, send_status

set_logging_config()

if (not is_display_busy()):
    send_status(False, True, "Starting display clear...")
    try:
        logging.info("********* Initializing display clear *********")
        epd = epd5in83_V2.EPD()
        epd.init()

        logging.info("Clearing...")
        epd.Clear()

        logging.info("Going to sleep...")
        epd.sleep()

        end_msg = "Display clear complete."
        logging.info(end_msg)
        send_status(False, False, end_msg)

    except IOError as e:
        logging.exception('IOError')
        send_status(True, False, "IOError while clearing display.")
        exit(3)

    except KeyboardInterrupt:
        logging.warning("Ctrl + C:")
        epd5in83_V2.epdconfig.module_exit()
        send_status(True, False, "Keyboard interrupt while clearing display.")
        exit(4)

    except BaseException:
        logging.exception('Unknown exception')
        send_status(True, False, "Unknown error while clearing display.")
        exit(5)
else:
    logging.info('Server is processing or waiting. Can not refresh right now.')
