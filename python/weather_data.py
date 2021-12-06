class WeatherData():
    sunrise_icon = "python/assets/icons/sunrise.png"
    sunset_icon = "python/assets/icons/sunset.png"
    forecast = []
    
    def __init__(self):
        self.current = ""
        self.current_temp = ""
        self.current_icon = ""
        self.sunrise = ""
        self.sunset = ""
        
    @property
    def current(self):
        return self._current
        
    @current.setter
    def current(self, a):
        self._current = a
        
    @property
    def current_temp(self):
        return self._current_temp
        
    @current_temp.setter
    def current_temp(self, a):
        self._current_temp = a
        
    @property
    def current_icon(self):
        return self._current_icon
        
    @current_icon.setter
    def current_icon(self, a):
        self._current_icon = a
        
    @property
    def sunrise(self):
        return self._sunrise
        
    @sunrise.setter
    def sunrise(self, a):
        self._sunrise = a
        
    @property
    def sunset(self):
        return self._sunset
        
    @sunset.setter
    def sunset(self, a):
        self._sunset = a
        
    def get_sunrise_icon(self):
        return self.sunrise_icon
        
    def get_sunset_icon(self):
        return self.sunset_icon
        
    def get_forecast(self):
        return self.forecast
        
    def add_forecasted_day(self, day):
        self.forecast.append(day)
        

class WeatherDay():
    def __init__(self):
        self.icon = ""
        self.day = ""
        self.temps = ""
        
    @property
    def icon(self):
        return self._icon
        
    @icon.setter
    def icon(self, a):
        self._icon = a
        
    @property
    def temps(self):
        return self._temps
        
    @temps.setter
    def temps(self, a):
        self._temps = a
        
    @property
    def day(self):
        return self._day
        
    @day.setter
    def day(self, a):
        self._day = a
    