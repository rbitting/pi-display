import os
import time
import textwrap
from . import epd5in83_V2
from .config import weather, crypto, pihole, network, news, dictionary, septa
from .dictionary import get_word_of_the_day
'''from config import weather, crypto, pihole, network, news, dictionary, septa
from crypto import print_crypto_prices
from dictionary import print_word_of_the_day
from network import print_network_speed, print_network_name
from news import print_news_headlines'''
from .util import get_current_date, get_current_date_time
from .weather import get_weather_data
from .weather_data import WeatherData
from .pihole import get_pihole_data, PiholeStatus
from .network import print_network_speed, get_network_name, get_offline_icon, get_online_icon
#from septa import print_next_bus
from PIL import Image, ImageDraw, ImageFont

def get_small_icon(path):
    icon = Image.open(path)
    return icon.resize((icon_size_sm,icon_size_sm));

def print_text_in_box(x, y, text):
    lines = textwrap.wrap(text, width=35, max_lines=3, placeholder="...")
    for line in lines:
        height = 24
        draw.text((x, y), line, font=font_md, fill=0)
        y += height

try:
    epd = epd5in83_V2.EPD()
    epd.init()
    
    pic = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'python', 'assets', 'lupa.jpg')
    font_italic = ImageFont.truetype('python/assets/fonts/Roboto-Italic.ttf', 18)
    font_sm = ImageFont.truetype('python/assets/fonts/Roboto-Regular.ttf', 16)
    font_md = ImageFont.truetype('python/assets/fonts/Roboto-Regular.ttf', 22)
    font_lg = ImageFont.truetype('python/assets/fonts/Roboto-Regular.ttf', 40)
    icon_w = 50
    icon_h = 50
    icon_size_sm = 40
    padding = 10
    padding_sm = padding/2
    padding_lg = padding*2
    col_1_w = 290
    
    print("here we go...")
    
    Himage = Image.new('1', (epd.width, epd.height), 255)  # 255: clear the frame
    draw = ImageDraw.Draw(Himage)
    
    network_name = get_network_name()
    is_connected = network_name != ''
    network_icon = ''
    if (is_connected):
        network_icon = get_online_icon()
    else:
        network_name = 'Not connected to wifi'
        network_icon = get_offline_icon()
    x = col_1_w + 100
    y = 0
    Himage.paste(get_small_icon(network_icon), (x,y))
    x = x + icon_size_sm + padding
    draw.text((x, y+padding), network_name, font = font_md, fill = 0)
    
    today_x = col_1_w + 30
    today_y = 60
    draw.text((today_x, today_y), get_current_date(), font = font_lg, fill = 0)
    
    if (weather['enabled']):
        weather = get_weather_data()
        print("current_icon: " + weather.current_icon)
        if os.path.exists(weather.current_icon):
            Himage.paste(Image.open(weather.current_icon), (0,0))   # Current weather icon
        draw.text((60, 0), weather.current_temp, font = font_lg, fill = 0)   # Current temperature
        draw.text((0, 50), weather.current, font = font_md, fill = 0)    # Feels like temp + high/low
        
        x = 160
        y = 15
        Himage.paste(get_small_icon(weather.get_sunrise_icon()), (x,y))   # Sunrise icon
        draw.text((x+icon_size_sm+padding_sm, y+padding), weather.sunrise, font = font_md, fill = 0)   # Sunrise time
        
        Himage.paste(get_small_icon(weather.get_sunset_icon()), (x,y+icon_size_sm))   # Sunset icon
        draw.text((x+icon_size_sm+padding_sm, y+icon_size_sm+padding), weather.sunset, font = font_md, fill = 0)   # Sunset time
        
        forecast = weather.get_forecast()
        y = 110 # Y coordinate (to display forecasts in a row)
        x = 0
        next_line = y + icon_size_sm
        
        for day in forecast:
            Himage.paste(get_small_icon(day.icon), (x,y))   # Forecasted weather icon
            draw.text((x+icon_size_sm+padding, y+padding_sm), day.day, font = font_sm, fill = 0)   # Day of week next to icon
            draw.text((x, next_line), day.temps, font = font_md, fill = 0)   # High/low below
            x += (icon_size_sm + 65)
        
        y = 190
        draw.line((0, y, col_1_w, y), fill = 0)
    
    if (pihole['enabled']):
        pihole = get_pihole_data()
        y = 200
        draw.text((64, y), pihole.status, font = font_md, fill = 0)    # "Pihole is [enabled/disabled]"
        draw.text((50, y + 30), pihole.stats, font = font_md, fill = 0) 
        draw.text((52, y + 58), 'requests            total requests', font = font_sm, fill = 0)
        draw.text((54, y + 74), 'blocked                  blocked', font = font_sm, fill = 0)
        
        x = 140
        draw.line((x, y + 40, x, y + 85), fill = 0) # Vertical line break
        
        y += 100
        draw.line((0, y, col_1_w, y), fill = 0) # Horizontal line break
    
    if (dictionary['enabled']):
        wotd = get_word_of_the_day()
        y = epd.height - 124
        draw.line((today_x, y-10, epd.width, y-10), fill = 0)
        draw.text((today_x, y), 'Word of the Day: ' + wotd.word, font = font_md, fill = 0)
        print_text_in_box(today_x, y+24, wotd.definition)
    
    
    draw.text((col_1_w + 100, epd.height - 20), 'Last updated ' + get_current_date_time(), font = font_italic, fill = 0)
    
    epd.display(epd.getbuffer(Himage))

    #print("Clear...")
    epd.Clear()
    
    print("Go to Sleep...")
    epd.sleep()

except IOError as e:
    print(e)
    
except KeyboardInterrupt:    
    print("ctrl + c:")
    epd5in83_V2.epdconfig.module_exit()
    exit()

'''print_network_name()

if (network['enabled']):
    print_network_speed()
    print('\n')

if (weather['enabled']):
    print_weather()
    print('\n')

if (crypto['enabled']):
    print_crypto_prices()
    print('\n')
    
if (news['enabled']):
    print_news_headlines()
    print('\n')

if (dictionary['enabled']):
    print_word_of_the_day()
    print('\n')

if (septa['enabled']):
    print_next_bus()
    print('\n')

print_current_date()
print('\n')

print('Last updated ' + get_current_date_time())'''