import sys
import epd5in83_V2
from PIL import Image, ImageDraw, ImageFont
import textwrap
from fonts import roboto, roboto_italic, noto_sans_mono
from util_dates import print_last_updated
from config import display_w, display_h

font_italic_sm = ImageFont.truetype(roboto_italic, 18)
font_md = ImageFont.truetype(roboto, 26)
font_lg = ImageFont.truetype(noto_sans_mono, 42)

def print_header(draw):
    draw.rectangle((0, 0, 648, 56), fill = 0)
    draw.text((10,10), "New Message", font=font_md, fill=255)

def print_msg_on_display(draw, msg):
    lines = textwrap.wrap(msg, width=20, max_lines=5, placeholder="...")
    og_y = 200
    y = 0
    max_x = 0
    centered_text = ''
    for line in lines:
        centered_line = line.center(35)
        width, height = font_lg.getsize(centered_line)
        centered_text += centered_line + '\n'
        if (width > max_x):
            max_x = width
        y += height
    x = (display_w - max_x) / 2
    y = (display_h - y) / 2
    draw.multiline_text((x, y), centered_text, font=font_lg, fill=0)

if (len(sys.argv) > 1):
    msg = sys.argv[1]
    try:
        epd = epd5in83_V2.EPD()
        epd.init()
        Himage = Image.new('1', (display_w, display_h), 255)
        draw = ImageDraw.Draw(Himage)

        print_header(draw)
        print_msg_on_display(draw, msg)
        last_updated = print_last_updated(draw, display_w, display_h)
        
        epd.display(epd.getbuffer(Himage))
        epd.sleep()
        print('{"code":200,"message":"Message received","data":"' + msg + '"}')


    except IOError as e:
        print('{"code":500,"message":"IO Error.","data":' + str(e) + '}')
        
    except KeyboardInterrupt:
        epd5in83_V2.epdconfig.module_exit()
        print('{"code":400,"message":"Keyboard interrupt","data":null}')
    
    except:
        e = sys.exc_info()[0]
        print('{"code":500,"message":"Unknown Error.","data":"' + str(e) + '"}')
else:
    print('{"code":400,"message":"No message received","data":null}')
