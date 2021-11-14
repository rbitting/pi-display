import subprocess
import json
import re

def print_network_speed():
    results = get_network_speed()
    print('/assets/icons/download.png ' + results['download'])
    print('/assets/icons/upload.png ' + results['upload'])

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

def print_network_name():
    network_name = get_network_name()
    if (network_name == ''):
        print('/assets/icons/offline.png' + ' Not connected to wifi')
    else:
        print('/assets/icons/wifi.png ' + network_name)

def get_network_name():
    r = subprocess.run(['netsh', 'wlan', 'show', 'interfaces'], stdout=subprocess.PIPE) # Get network info
    result = r.stdout.decode('utf-8')
    regex_result = re.search('Profile                : (.*)\n', result) # Find network name in returned info(\d+) Mbps
    if (regex_result is None):  # If regex fails, wifi is not connected
        return ''
    else:
        return regex_result.group(1)