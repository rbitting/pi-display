import logging

from settings import PiholeSettings
from shared import FONT_SM, FONT_MD, COL_1_W, PADDING
from util_fetch import fetch
from util_formatting import get_x_for_centered_text

class PiholeStatus():
    def __init__(self):
        self.status = False
        self.stats = ''

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, a):
        self._status = a

    @property
    def ads_blocked(self):
        return self._ads_blocked

    @ads_blocked.setter
    def ads_blocked(self, a):
        self._ads_blocked = a

    @property
    def ads_percentage(self):
        return self._ads_percentage

    @ads_percentage.setter
    def ads_percentage(self, a):
        self._ads_percentage = a

def get_pihole_data(settings: PiholeSettings):
    results = fetch_pihole_data(settings)
    if results is None:
        return None

    if (results):
        data = PiholeStatus()
        data.status = 'Pi-Hole is ' + results['status']
        data.ads_blocked = results['ads_blocked_today'] 
        data.ads_percentage = results['ads_percentage_today'] + '%'
        return data
    else:
        logging.error('No results returned from fetch_pihole_data.')
        return None

def fetch_pihole_data(settings: PiholeSettings):
    return fetch('http://' + settings.ip + '/admin/api.php?summary')

def print_pihole_data(settings: PiholeSettings, draw):
    pihole_data = get_pihole_data(settings)
    y = 220
    middle_x = 160
    end = middle_x - PADDING + middle_x

    if pihole_data is not None:
        total = pihole_data.ads_blocked
        percent = pihole_data.ads_percentage
        logging.info(pihole_data.status + '. Requests: ' + total + ', % of Requests: ' + percent)

        # General status - 'Pihole is [enabled/disabled]'
        draw.text((get_x_for_centered_text(pihole_data.status, FONT_MD, PADDING, end), y), pihole_data.status, font=FONT_MD, fill=0)    
        
        # Draw left side
        draw.text((get_x_for_centered_text(total, FONT_MD, PADDING, middle_x), y + 30), total, font=FONT_MD, fill=0)
        draw.text((get_x_for_centered_text('requests', FONT_SM, PADDING, middle_x), y + 58), 'requests', font=FONT_SM, fill=0)
        draw.text((get_x_for_centered_text('blocked', FONT_SM, PADDING, middle_x), y + 74), 'blocked', font=FONT_SM, fill=0)
        
        # Vertical line break
        draw.line((middle_x, y + 40, middle_x, y + 85), fill=0)  

        # Draw right side
        draw.text((get_x_for_centered_text(percent, FONT_MD, middle_x, end), y + 30), percent, font=FONT_MD, fill=0)
        draw.text((get_x_for_centered_text('of all requests', FONT_SM, middle_x, end), y + 58), 'of all requests', font=FONT_SM, fill=0)
        draw.text((get_x_for_centered_text('blocked', FONT_SM, middle_x, end), y + 74), 'blocked', font=FONT_SM, fill=0)
    else:
        logging.warn('Pi-Hole data was not retrieved.')

    y += 110
    draw.line((20, y, COL_1_W, y), fill=0)  # Horizontal line break
