import logging
import math
from datetime import datetime

from config import COL_1_W, FONT_MD, FONT_SM, PADDING, septa
from util_fetch import fetch
from util_formatting import get_small_icon
from util_os import get_absolute_path

class BusArrival():
    def __init__(self):
        self.eta = ""
        self.date = ""

    @property
    def eta(self):
        return self._eta

    @eta.setter
    def eta(self, a):
        self._eta = a

    @property
    def date(self):
        return self._date

    @date.setter
    def date(self, a):
        self._date = a


class BusStatus():
    next_arrivals = []

    def __init__(self):
        self.route = ""

    @property
    def route(self):
        return self._route

    @route.setter
    def route(self, a):
        self._route = a

    def get_arrivals(self):
        return self.next_arrivals

    def add_arrival(self, a):
        self.next_arrivals.append(a)

    def clear_arrivals(self):
        self.next_arrivals = []

def get_next_buses():
    routes = septa.get('routes')
    buses = []
    for route in routes:
        arrival = BusStatus()
        results = fetch_next_buses(route)
        if results is not None:
            error = results.get('message')
            if (error):
                logging.error(error)
            else:
                route_num = route.get('route')
                min_range = min([len(results.get(route_num)), septa.get('num')])
                bus_route = results.get(route_num)
                arrival.route = route_num
                arrival.clear_arrivals()
                for i in range(min_range):
                    bus = BusArrival()
                    bus.date = bus_route[i].get('DateCalender')
                    # get_minutes_until_bus(bus_route[i].get('date'))
                    bus.eta = bus_route[i].get('date') + 'm'
                    arrival.add_arrival(bus)
                buses.append(arrival)
        else:
            logging.warn('Could not fetch bus route: ' + route)
    return buses

def fetch_next_buses(route):
    return fetch('https://www3.septa.org/hackathon/BusSchedules/?req1=' +
                 route.get('stop') + '&req2=' + route.get('route'))

def get_minutes_until_bus(bus_time):
    time = bus_time.replace('a', '').replace('p', '').split(':')  # ['6','30']
    date = datetime.today()
    day = date.day
    hour = int(time[0])
    is_am = 'a' in bus_time
    if (is_am and hour == 12):  # Convert 12am to 0 (24-hour time)
        hour = 0
    if (date.strftime('%p') == 'PM' and is_am):
        day = day + 1   # If today is currently PM and bus time is AM, bus arrival is the next day
    elif (not is_am and hour != 12):
        hour += 12  # Convert from 12-hour to 24-hour time
    bus_date = date.replace(hour=hour, minute=int(time[1]), day=day)
    seconds = abs((bus_date - date).seconds)
    minutes = seconds / 60
    if minutes < 60:
        return str(round(minutes)) + 'm'
    return get_hours_and_min(minutes)

def get_hours_and_min(minutes):
    hours = math.floor(minutes / 60)
    minutes = round(minutes % 60)
    return str(hours) + 'h ' + str(minutes) + 'm'

def get_bus_icon():
    return 'python/assets/icons/septa.png'

def print_septa_data(Himage, draw):
    septa_y = 335
    x = 80
    bus_routes = get_next_buses()
    Himage.paste(get_small_icon(get_absolute_path(get_bus_icon())), (20, septa_y+4))
    for bus in bus_routes:
        y = septa_y
        draw.text((x, y), bus.route, font=FONT_MD, fill=0)
        y += 28
        arrivals = bus.get_arrivals()
        for arrival in arrivals:
            draw.text((x, y), arrival.eta, font=FONT_SM, fill=0)
            y += 22
        x += 75
    y += 8
    draw.line((20, y, COL_1_W, y), fill=0)  # Horizontal line break
