import epd5in83_V2
from config import weather, crypto, pihole, network, news, dictionary, septa, display_w, display_h
from dictionary import print_word_of_the_day
'''
from crypto import print_crypto_prices
from network import print_network_speed, print_network_name
'''
from pihole import print_pihole_data
from network import print_wifi_info
from news import get_news_headlines, print_news_data
from septa import print_septa_data
from util_dates import get_current_date_time, print_last_updated, print_todays_date
from weather import print_weather
from PIL import Image, ImageDraw

def print_all_data():
    try:
        print("Initializing display refresh " + get_current_date_time())
        
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
        
        if (dictionary['enabled']):
            print_word_of_the_day(draw)
        
        if (news['enabled']):
            print_news_data(draw)
        
        last_updated = print_last_updated(draw, display_w, display_h)
        print(last_updated)
        
        epd.display(epd.getbuffer(Himage))
        
        print("Go to Sleep...")
        epd.sleep()
        
        print("Completed refresh " + get_current_date_time())

    except IOError as e:
        print(e)
        
    except KeyboardInterrupt:    
        print("ctrl + c:")
        epd5in83_V2.epdconfig.module_exit()
        exit()

print_all_data()

'''
if (network['enabled']):
    print_network_speed()

if (crypto['enabled']):
    print_crypto_prices()
'''