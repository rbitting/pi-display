import sys
import epd5in83_V2
from PIL import Image, ImageDraw, ImageFont
import textwrap
import os
from util import print_last_updated

font_italic_sm = ImageFont.truetype(os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))),'python/assets/fonts/Roboto-Italic.ttf'), 18)
font_md = ImageFont.truetype(os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'python/assets/fonts/Roboto-Regular.ttf'), 26)
font_lg = ImageFont.truetype(os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'python/assets/fonts/NotoSansMono-Regular.ttf'), 42)

def print_header(draw):
    draw.rectangle((0, 0, 648, 56), fill = 0)
    draw.text((10,10), "New Message", font=font_md, fill=255)

def print_msg_on_display(draw, msg):
    lines = textwrap.wrap(msg, width=20, max_lines=5, placeholder="...")
    og_y = 200
    y = 0
    max_x = 0;
    centered_text = ''
    for line in lines:
        centered_line = line.center(35)
        width, height = font_lg.getsize(centered_line)
        centered_text += centered_line + '\n'
        if (width > max_x):
            max_x = width
        y += height
    x = (epd.width - max_x) / 2
    y = (epd.height - y) / 2
    draw.multiline_text((x, y), centered_text, font=font_lg, fill=0)

if (len(sys.argv) > 1):
    msg = sys.argv[1]
    try:
        epd = epd5in83_V2.EPD()
        epd.init()
        Himage = Image.new('1', (epd.width, epd.height), 255)
        draw = ImageDraw.Draw(Himage)

        print_header(draw)
        print_msg_on_display(draw, msg)
        last_updated = print_last_updated(draw, font_italic_sm, epd.width, epd.height)
        
        epd.display(epd.getbuffer(Himage))
        epd.sleep()
        print('{"code":200,"message":"Message received","data":"' + msg + '"}')


    except IOError as e:
        print('{"code":500,"message":"IO Error.","data":' + str(e) + '}')
        
    except KeyboardInterrupt:
        epd5in83_V2.epdconfig.module_exit()
        print('{"code":400,"message":"Keyboard interrupt","data":null}')
    
    except:
        print("here")
        e = sys.exc_info()[0]
        print(sys.exc_info())
        print('{"code":500,"message":"Unknown Error.","data":' + str(e) + '}')


else:
    print('{"code":400,"message":"No message received","data":null}')
