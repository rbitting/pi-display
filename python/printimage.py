import logging
import sys

from PIL import Image, ImageDraw

import epd5in83_V2
from shared import DISPLAY_H, DISPLAY_W
from util_logging import set_logging_config
from util_os import path_exists
from util_server import send_status

PREFIX = 'Image Display: '
IMAGE_DIR = ''  # '../webapp/'

set_logging_config()


def get_resized_image(image):
  height = image.height
  width = image.width
  new_width = width
  new_height = height
  logging.info("New height: " + str(new_height) + ", New width: " + str(new_height))

  # If image is smaller than display, no resize is needed
  if (height <= DISPLAY_H and width <= DISPLAY_W):
    logging.info("Original image is smaller than display")
    return image

  # Resize photo if larger than display
  if (height > width):
    if (height > DISPLAY_H):
      ratio = height / DISPLAY_H
      new_height = DISPLAY_H
      new_width = round(width / ratio)
  else:
    if (width > DISPLAY_W):
      ratio = width / DISPLAY_W
      new_width = DISPLAY_W
      new_height = round(height / ratio)

  logging.info("New height: " + str(new_height) + ", New width: " + str(new_height))
  return image.resize((new_width, new_height))


logging.info("********* Initializing image refresh *********")
if (len(sys.argv) > 1):
  img = IMAGE_DIR + sys.argv[1]
  logging.info('Image path: ' + img)
  send_status(False, True, PREFIX + "Starting image display...")
  try:
    if (path_exists(img)):
      # Init display and image
      epd = epd5in83_V2.EPD()
      epd.init()
      Himage = Image.new('1', (DISPLAY_W, DISPLAY_H), 255)
      draw = ImageDraw.Draw(Himage)

      image = get_resized_image(Image.open(img))  # Resize image to fit on display
      x = round((DISPLAY_W - image.width) / 2)   # Centered horizontally
      y = round((DISPLAY_H - image.height) / 2)   # Centered vertically
      Himage.paste(image, (x, y))

      # Print on display
      epd.display(epd.getbuffer(Himage))
      epd.sleep()

      # Done
      end_msg = 'Image printed.'
      logging.info(end_msg)
      send_status(False, False, PREFIX + end_msg)
      print('{"code":200,"message":"' + end_msg + '","data":"' + img + '"}')
    else:
      logging.error('Image does not exist at path: ' + img)
      print('{"code":400,"message":"Image does not exist at path.","data":"' + img + '"}')

  except IOError as e:
    logging.exception('IOError')
    send_status(True, False, PREFIX + "IOError while displaying image.")
    print('{"code":500,"message":"IO Error.","data":' + str(e) + '}')

  except KeyboardInterrupt:
    epd5in83_V2.epdconfig.module_exit()
    logging.exception('Keyboard interrupt')
    send_status(True, False, PREFIX + "Keyboard interrupt while displaying image.")
    print('{"code":400,"message":"Keyboard interrupt","data":null}')

  except BaseException:
    e = sys.exc_info()[0]
    logging.exception('Unknown error')
    send_status(True, False, PREFIX + "Unknown error while displaying image.")
    print('{"code":500,"message":"Unknown Error.","data":"' + str(e) + '"}')
else:
  no_msg_response = 'No image received.'
  logging.warning(no_msg_response)
  send_status(True, False, PREFIX + no_msg_response)
  print('{"code":400,"message":"' + no_msg_response + '","data":null}')
