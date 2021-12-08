import sys
import epd5in83_V2
from PIL import Image, ImageDraw, ImageFont
import textwrap

font = ImageFont.truetype('python/assets/fonts/Roboto-Regular.ttf', 22)

def print_header(draw):
    draw.rectangle((0, 0, 42, 648), fill = 0)
    draw.text((10,10), "New Message", font=font, fill=255)

def print_msg_on_display(draw, msg):
    lines = textwrap.wrap(msg, width=100, max_lines=10, placeholder="...")
    y = 200
    for line in lines:
        width, height = font.getsize(line)
        draw.text((30, y), line.center(100), font=font, fill=0)
        y += height + 3

if (len(sys.argv) > 1):
    msg = sys.argv[1]
    try:
        epd = epd5in83_V2.EPD()
        epd.init()
        Himage = Image.new('1', (epd.width, epd.height), 255)
        draw = ImageDraw.Draw(Himage)

        print_header(draw)
        print_msg_on_display(draw, msg)

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
        print('{"code":500,"message":"Unknown Error.","data":' + str(e) + '}')


else:
    print('{"code":400,"message":"No message received","data":null}')
