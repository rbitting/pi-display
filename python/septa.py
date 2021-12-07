from .config import septa;
from .util import fetch;
from datetime import datetime
import math 

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
        route_num = route.get('route')
        min_range = min([len(results.get(route_num)), septa.get('num')])
        bus_route = results.get(route_num)
        arrival.route = route_num
        arrival.clear_arrivals()
        for i in range(min_range):
            bus = BusArrival()
            bus.date = bus_route[i].get('DateCalender')
            bus.eta = get_minutes_until_bus(bus_route[i].get('date'))
            arrival.add_arrival(bus)
        buses.append(arrival)
    return buses

def fetch_next_buses(route):
    return fetch('https://www3.septa.org/hackathon/BusSchedules/?req1=' + route.get('stop') + '&req2=' + route.get('route'))

def get_minutes_until_bus(bus_time):
    time = bus_time.replace('a', '').replace('p', '').split(':') # ['6','30']
    date = datetime.today()
    day = date.day
    hour = int(time[0])
    if (date.strftime('%p') == 'PM' and 'a' in bus_time):   
        day = day + 1   # If today is currently PM and bus time is AM, bus arrival is the next day
    elif ('p' in bus_time):
        hour += 12  # Convert from 12-hour to 24-hour time
    bus_date = date.replace(hour=hour, minute=int(time[1]), day=day)
    seconds = abs((bus_date - date).seconds)
    minutes = seconds/60
    if minutes < 60:
        return str(round(minutes)) + 'm'
    return get_hours_and_min(minutes)

def get_hours_and_min(minutes):
    hours = math.floor(minutes/60)
    minutes = round(minutes % 60)
    return str(hours) + 'h ' + str(minutes) + 'm'
    
def get_bus_icon():
    return 'python/assets/icons/septa.png'