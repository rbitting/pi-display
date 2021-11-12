import os
from config import pihole
from modules.util import fetch

ENV_KEY = 'PIHOLE_ADDRESS'

def print_pihole_data():
    results = get_pihole_data()
    if (results):
        print('Pihole is ' + results['status'])
        print(results['ads_blocked_today'] + ' | ' + results['ads_percentage_today'] + '%')

def get_pihole_data():
    if (pihole['ip']):
        return fetch('http://' + pihole['ip'] + '/admin/api.php?summary')
    else:
        print('Pihole IP adress (' + pihole['env_var'] + ') is not defined in environment variables.')
        return