import requests
import json

def send_status(last_refresh, isError, message):
    headers = {
        'Accepts': 'application/json',
        'Content-Type': 'application/json'
    }
    body = {
        "lastRefresh": last_refresh,
        "isError": isError,
        "message": message
    }
    try:
        r = requests.post('http://localhsdfsdfdfsost:3000/display-status', data=json.dumps(body), headers=headers)
        print(json.loads(r.text))
    except requests.exceptions.RequestException as e:
        print('Could not send status update: ' + str(e))