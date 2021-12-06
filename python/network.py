import subprocess
import json
import re

def print_network_speed():
    results = get_network_speed()
    print('python/assets/icons/download.png ' + results['download'])
    print('python/assets/icons/upload.png ' + results['upload'])

def get_network_speed():
    # TODO: Run in new thread to avoid lagging
    r = subprocess.run(['fast', '-u', '--single-line'], stdout=subprocess.PIPE, shell=True)
    results = r.stdout.decode('utf-8')
    
    # There are hundreds of results logged to stdout, we only want the final
    regex_result = re.findall('(\d+ Mbps)', results)
    last_index = len(regex_result) - 1
    second_to_last_index = last_index - 1
    return {
        'download': regex_result[second_to_last_index],
        'upload': regex_result[last_index]
    }


def get_network_name():
    r = subprocess.run(['iwgetid'], stdout=subprocess.PIPE) # Get network info
    result = r.stdout.decode('utf-8')
    regex_result = re.search('ESSID:"(.*)"', result) # Find network name in returned info
    if (regex_result is None):  # If regex fails, wifi is not connected
        return ''
    else:
        return regex_result.group(1)
        
def get_online_icon():
    return 'python/assets/icons/wifi.png'

def get_offline_icon():
    return 'python/assets/icons/offline.png';