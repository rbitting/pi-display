import logging

from config import pihole, FONT_SM, FONT_MD, COL_1_W
from util_fetch import fetch

class PiholeStatus():
    def __init__(self):
        self.status = False
        self.stats = ""

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, a):
        self._status = a

    @property
    def stats(self):
        return self._stats

    @stats.setter
    def stats(self, a):
        self._stats = a

def get_pihole_data():
    results = fetch_pihole_data()
    if (results):
        data = PiholeStatus()
        data.status = 'Pi-Hole is ' + results['status']
        data.stats = results['ads_blocked_today'] + \
            '             ' + results['ads_percentage_today'] + '%'
        return data
    else:
        logging.error('No results returned from fetch_pihole_data.')
        exit(2)

def fetch_pihole_data():
    if (pihole['ip']):
        return fetch('http://' + pihole['ip'] + '/admin/api.php?summary')
    else:
        logging.error('Pihole IP adress (' + pihole['env_var'] +
              ') is not defined in environment variables.')
        exit(1)
        return

def print_pihole_data(draw):
    pihole_data = get_pihole_data()
    y = 220
    logging.info(pihole_data.status)
    logging.info(pihole_data.stats)
    draw.text((84, y), pihole_data.status, font=FONT_MD, fill=0)    # "Pihole is [enabled/disabled]"
    draw.text((70, y + 30), pihole_data.stats, font=FONT_MD, fill=0)
    draw.text((72, y + 58), 'requests           of all requests', font=FONT_SM, fill=0)
    draw.text((74, y + 74), 'blocked                 blocked', font=FONT_SM, fill=0)

    x = 160
    draw.line((x, y + 40, x, y + 85), fill=0)  # Vertical line break

    y += 110
    draw.line((20, y, COL_1_W, y), fill=0)  # Horizontal line break
