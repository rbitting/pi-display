import logging

from PIL import Image, ImageDraw

import epd5in83_V2
from config import (crypto, word_of_the_day, display_h, display_w, network, news, pihole, septa, weather)
from word_of_the_day import print_word_of_the_day
from network import print_wifi_info
from news import print_news_data
from pihole import print_pihole_data
from util_logging import set_logging_config
from septa import print_septa_data
from util_dates import (get_current_date_time, print_last_updated, print_todays_date)
from util_server import is_display_busy, send_status
from weather import print_weather

set_logging_config()

'''
from crypto import print_crypto_prices
from network import print_network_speed, print_network_name
'''

if (not is_display_busy()):
    send_status(False, True, "Starting display refresh...")
    try:
        logging.info('********* Initializing display refresh *********')

        # Init display
        epd = epd5in83_V2.EPD()
        epd.init()

        # Init new image to draw
        Himage = Image.new('1', (display_w, display_h), 255)
        draw = ImageDraw.Draw(Himage)

        print_wifi_info(Himage, draw)

        print_todays_date(draw)

        if (weather['enabled']):
            print_weather(Himage, draw)

        if (pihole['enabled']):
            print_pihole_data(draw)

        if (septa['enabled']):
            print_septa_data(Himage, draw)

        if (word_of_the_day['enabled']):
            print_word_of_the_day(draw)

        if (news['enabled']):
            print_news_data(draw)

        last_updated = print_last_updated(draw, display_w, display_h)
        logging.debug(last_updated)

        epd.display(epd.getbuffer(Himage))

        logging.debug('Going to Sleep...')
        epd.sleep()

        logging.info('Completed refresh ' + get_current_date_time())

        send_status(False, False, "Display refresh complete.")

    except IOError as e:
        logging.exception('IOError')
        send_status(True, False, "IOError while refreshing display.")

    except KeyboardInterrupt:
        logging.warning('ctrl + c:')
        epd5in83_V2.epdconfig.module_exit()
        send_status(True, False, "Keyboard interrupt while refreshing display.")
        exit()
else:
    logging.info('Server is processing or waiting. Can not refresh right now.')

'''
if (network['enabled']):
    print_network_speed()

if (crypto['enabled']):
    print_crypto_prices()
'''
