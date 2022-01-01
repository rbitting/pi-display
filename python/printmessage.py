import logging
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

import epd5in83_V2
from config import DISPLAY_H, DISPLAY_W
from fonts import NOTO_SANS_MONO, ROBOTO, ROBOTO_ITALIC
from util_dates import print_last_updated
from util_logging import set_logging_config
from util_server import send_status

FONT_ITALIC_SM = ImageFont.truetype(ROBOTO_ITALIC, 18)
FONT_MD = ImageFont.truetype(ROBOTO, 26)
FONT_LG = ImageFont.truetype(NOTO_SANS_MONO, 42)

PREFIX = 'Message Display: '

set_logging_config()

def print_header(draw):
    draw.rectangle((0, 0, 648, 56), fill=0)
    draw.text((10, 10), "New Message", font=FONT_MD, fill=255)

def print_msg_on_display(draw, msg):
    lines = textwrap.wrap(msg, width=20, max_lines=5, placeholder="...")
    og_y = 200
    y = 0
    max_x = 0
    centered_text = ''
    for line in lines:
        centered_line = line.center(35)
        width, height = FONT_LG.getsize(centered_line)
        centered_text += centered_line + '\n'
        if (width > max_x):
            max_x = width
        y += height
    x = (DISPLAY_W - max_x) / 2
    y = (DISPLAY_H - y) / 2
    draw.multiline_text((x, y), centered_text, font=FONT_LG, fill=0)

logging.info("********* Initializing message refresh *********")
if (len(sys.argv) > 1):
    msg = sys.argv[1]
    logging.info('Message: ' + msg)
    send_status(False, True, PREFIX + "Starting message display...")
    try:
        epd = epd5in83_V2.EPD()
        epd.init()
        Himage = Image.new('1', (DISPLAY_W, DISPLAY_H), 255)
        draw = ImageDraw.Draw(Himage)

        print_header(draw)
        print_msg_on_display(draw, msg)
        last_updated = print_last_updated(draw, DISPLAY_W, DISPLAY_H)
        logging.info(last_updated)

        epd.display(epd.getbuffer(Himage))
        epd.sleep()
        
        end_msg = 'Message printed'
        logging.info(end_msg)
        send_status(False, False, PREFIX + end_msg)
        print('{"code":200,"message":"Message received","data":"' + msg + '"}')

    except IOError as e:
        logging.exception('IOError')
        send_status(True, False, PREFIX + "IOError while displaying message.")
        print('{"code":500,"message":"IO Error.","data":' + str(e) + '}')

    except KeyboardInterrupt:
        epd5in83_V2.epdconfig.module_exit()
        logging.exception('Keyboard interrupt')
        send_status(True, False, PREFIX + "Keyboard interrupt while displaying message.")
        print('{"code":400,"message":"Keyboard interrupt","data":null}')

    except BaseException:
        e = sys.exc_info()[0]
        logging.exception('Unknown error')
        send_status(True, False, PREFIX + "Unknown error while displaying message.")
        print('{"code":500,"message":"Unknown Error.","data":"' + str(e) + '"}')
else:
    no_msg_response = 'No message received.'
    logging.warning(no_msg_response)
    send_status(True, False, PREFIX + no_msg_response)
    print('{"code":400,"message":"' + no_msg_response + '","data":null}')
