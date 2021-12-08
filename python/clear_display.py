
import epd5in83_V2
from util import get_current_date_time

try:
    print("Display clear starting " + get_current_date_time())
    epd = epd5in83_V2.EPD()
    epd.init()

    print("Clearing...")
    epd.Clear()

    print("Going to sleep...")
    epd.sleep()
    
    print("Display clear complete " + get_current_date_time())

except IOError as e:
    print(e)
    exit(3)

except KeyboardInterrupt:    
    print("ctrl + C:")
    epd5in83_V2.epdconfig.module_exit()
    exit(4)