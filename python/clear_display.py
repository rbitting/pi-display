import logging 
import epd5in83_V2
from util_dates import get_current_date_time

logging.basicConfig(level=logging.INFO, filename='../../../logs/main.log', encoding='utf-8', format='[%(levelname)s] %(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')

try:
    logging.info("********* Initializing display clear *********")
    epd = epd5in83_V2.EPD()
    epd.init()

    logging.info("Clearing...")
    epd.Clear()

    logging.info("Going to sleep...")
    epd.sleep()

    end_time = get_current_date_time()
    end_msg = "Display clear complete"
    logging.info(end_msg + " " + end_time)

except IOError as e:
    logging.exception('IOError')
    exit(3)

except KeyboardInterrupt:
    logging.warning("Ctrl + C:")
    epd5in83_V2.epdconfig.module_exit()
    exit(4)

except BaseException:
    logging.exception('Unknown exception')
    exit(5)
