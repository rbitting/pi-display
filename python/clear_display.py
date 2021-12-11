import epd5in83_V2
from util_dates import get_current_date_time

try:
    start_time = get_current_date_time()
    start_msg = 'Starting display clear...'
    print(start_msg + " " + start_time)
    epd = epd5in83_V2.EPD()
    epd.init()

    print("Clearing...")
    epd.Clear()

    print("Going to sleep...")
    epd.sleep()

    end_time = get_current_date_time()
    end_msg = "Display clear complete"
    print(end_msg + " " + end_time)

except IOError as e:
    print(e)
    completed = get_current_date_time()
    exit(3)

except KeyboardInterrupt:
    print("ctrl + C:")
    epd5in83_V2.epdconfig.module_exit()
    completed = get_current_date_time()
    exit(4)

except BaseException:
    completed = get_current_date_time()
    exit(5)
