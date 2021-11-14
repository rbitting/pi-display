from config import septa;
from util import fetch;
from datetime import datetime
import math

def print_next_bus():
    routes = septa.get('routes')
    for route in routes:
       results = get_next_buses(route)
       route_num = route.get('route')
       print(route_num)
       min_range = min([len(results.get(route_num)), septa.get('num')])
       bus_route = results.get(route_num)
       for i in range(min_range):
           print(bus_route[i].get('DateCalender'))
           print(get_minutes_until_bus(bus_route[i].get('date')))

def get_next_buses(route):
    return fetch('https://www3.septa.org/hackathon/BusSchedules/?req1=' + route.get('stop') + '&req2=' + route.get('route'))

def get_minutes_until_bus(bus_time):
    time = bus_time.replace('a', '').replace('p', '').split(':') # ['6','30']
    date = datetime.today()
    day = date.day
    if (date.strftime('%p') == 'PM' and 'p' in bus_time):   
        day = day + 1   # If today is currently PM and bus time is AM, bus arrival is the next day
    bus_date = date.replace(hour=int(time[0]), minute=int(time[1]), day=day)
    seconds = abs((bus_date - date).seconds)
    minutes = seconds/60
    if minutes < 60:
        return str(round(minutes)) + 'm'
    return get_hours_and_min(minutes)

def get_hours_and_min(minutes):
    hours = math.floor(minutes/60)
    minutes = round(minutes % 60)
    return str(hours) + 'h ' + str(minutes) + 'm'