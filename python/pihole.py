from config import pihole, font_sm, font_md, col_1_w
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
        exit(2)

def fetch_pihole_data():
    if (pihole['ip']):
        return fetch('http://' + pihole['ip'] + '/admin/api.php?summary')
    else:
        print('Pihole IP adress (' + pihole['env_var'] +
              ') is not defined in environment variables.')
        exit(1)
        return

def print_pihole_data(draw):
    pihole_data = get_pihole_data()
    y = 200
    print(pihole_data.status)
    print(pihole_data.stats)
    draw.text((64, y), pihole_data.status, font=font_md, fill=0)    # "Pihole is [enabled/disabled]"
    draw.text((50, y + 30), pihole_data.stats, font=font_md, fill=0)
    draw.text((52, y + 58), 'requests           of all requests', font=font_sm, fill=0)
    draw.text((54, y + 74), 'blocked                 blocked', font=font_sm, fill=0)

    x = 140
    draw.line((x, y + 40, x, y + 85), fill=0)  # Vertical line break

    y += 100
    draw.line((0, y, col_1_w, y), fill=0)  # Horizontal line break
