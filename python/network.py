import logging
import re
import subprocess

from shared import FONT_SM, ICON_SIZE_XS, PADDING, DISPLAY_W
from util_formatting import get_xsmall_icon, get_width_of_text
from util_os import get_absolute_path


def print_network_speed():
  results = get_network_speed()
  logging.info('python/assets/icons/download.png ' + results['download'])
  logging.info('python/assets/icons/upload.png ' + results['upload'])


def get_network_speed():
  # TODO: Run in new thread to avoid lagging
  r = subprocess.run(['fast', '-u', '--single-line'], stdout=subprocess.PIPE, shell=True)
  results = r.stdout.decode('utf-8')

  # There are hundreds of results logged to stdout, we only want the final
  regex_result = re.findall('(\\d+ Mbps)', results)
  last_index = len(regex_result) - 1
  second_to_last_index = last_index - 1
  return {
      'download': regex_result[second_to_last_index],
      'upload': regex_result[last_index]
  }


def get_network_name():
  r = subprocess.run(['iwgetid'], stdout=subprocess.PIPE)  # Get network info
  result = r.stdout.decode('utf-8')
  # Find network name in returned info
  regex_result = re.search('ESSID:"(.*)"', result)
  if (regex_result is None):  # If regex fails, wifi is not connected
    return ''
  else:
    return regex_result.group(1)


def get_online_icon():
  return 'python/assets/icons/wifi.png'


def get_offline_icon():
  return 'python/assets/icons/offline.png'


def print_wifi_info(Himage, draw):
  network_name = get_network_name()
  is_connected = network_name != ''
  network_icon = ''
  if (is_connected):
    network_icon = get_online_icon()
  else:
    network_name = 'Not connected to wifi'
    network_icon = get_offline_icon()
  width = get_width_of_text(FONT_SM, network_name) + ICON_SIZE_XS + PADDING
  x = DISPLAY_W - width - 20
  y = 10
  Himage.paste(get_xsmall_icon(get_absolute_path(network_icon)), (x, y - 2))
  x = x + ICON_SIZE_XS + PADDING
  logging.info('Network name: ' + network_name)
  draw.text((x, y), network_name, font=FONT_SM, fill=0)
