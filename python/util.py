import json
import requests
from datetime import datetime

day_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

def fetch(url):
    try:
        r = requests.get(url)
        return json.loads(r.text)
    except requests.exceptions.RequestException as e:
        print('Could not fetch: ' + url)
        return

def fetch_with_headers_params(url, headers, params):
    try:
        r = requests.get(url, headers=headers, params=params)
        return json.loads(r.text)
    except requests.exceptions.RequestException as e:
        print('Could not fetch with headers and params: ' + url)
        return

def get_day_of_week_from_ms(ms):
    date = get_date_from_ms(ms)
    return get_day_of_week(date)

def get_time_from_ms(ms):
    date = get_date_from_ms(ms)
    return date.strftime('%I:%M %p')

def get_date_from_ms(ms):
    return datetime.utcfromtimestamp(ms)

def get_day_of_week(date):
    return day_of_week[date.weekday()]

def get_current_date():
    date = datetime.today()
    if (date.month == 3 and date.day == 19):
        print('Happy birthday!')
    return get_day_of_week(date) + ', \n' + date.strftime('%B %d')

def get_current_date_time():
    date = datetime.today()
    return date.strftime('%b %d, %I:%M:%S %p')

def print_current_date():
    print(get_current_date())