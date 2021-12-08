
import epd5in83_V2
from util import get_current_date_time
from send_status import send_status

try:
    start_time = get_current_date_time()
    start_msg = 'Starting display clear...'
    print(start_msg + " " + start_time)
    send_status(start_time, False, start_msg)
    epd = epd5in83_V2.EPD()
    epd.init()

    print("Clearing...")
    epd.Clear()

    print("Going to sleep...")
    epd.sleep()
    
    end_time = get_current_date_time()
    end_msg = "Display clear complete"
    print(end_msg + " " + end_time)
    send_status(end_time, False, end_msg)

except IOError as e:
    print(e)
    completed = get_current_date_time()
    send_status(completed, True, 'IOError: ' + str(e))
    exit(3)

except KeyboardInterrupt:    
    print("ctrl + C:")
    epd5in83_V2.epdconfig.module_exit()
    completed = get_current_date_time()
    send_status(completed, True, 'Keyboard interrupt clearing process.')
    exit(4)

except:
    completed = get_current_date_time()
    send_status(completed, True, 'Unknown error while clearing display.')
    exit(5)