import os
from config import pihole
from util import fetch
        
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
        data.stats = results['ads_blocked_today'] + '             ' + results['ads_percentage_today'] + '%'
        return data
    else:
        exit(2)

def fetch_pihole_data():
    if (pihole['ip']):
        return fetch('http://' + pihole['ip'] + '/admin/api.php?summary')
    else:
        print('Pihole IP adress (' + pihole['env_var'] + ') is not defined in environment variables.')
        exit(1)
        return