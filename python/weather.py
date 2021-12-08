from util import fetch, get_day_of_week_from_ms, get_time_from_ms
from config import weather
from weather_data import WeatherData, WeatherDay

def get_weather_data():
    results = fetch_weather_data()
    error_code = results.get('cod')
    if (error_code):
        print(str(error_code) + ' ' + results.get('message'))
        exit(2)
    else:
        weather = WeatherData()
        current = results['current']
        weather_id = current['weather'][0]['id']
        
        weather.current_icon_id = str(weather_id)
        weather.current_icon = get_weather_icon(weather_id) # Current weather icon
        weather.current_desc = current['weather'][0]['main'] # Current weather short description (ex. 'Clouds')
        today_forecast = results['daily'][0]['temp']
        weather.current_temp = str(round(current['temp'])) + '°'
        weather.current = ('Feels Like: ' + str(round(current['feels_like'])) + '°\n' + # Feels like temp 
            str(round(today_forecast['max'])) + '° | ' + str(round(today_forecast['min'])) + '°') # Today's high and low
        weather.sunrise = get_time_from_ms(current['sunrise'] + results['timezone_offset'])
        weather.sunset = get_time_from_ms(current['sunset'] + results['timezone_offset'])
        get_forecast(results['daily'], weather)
        return weather

def fetch_weather_data():
    api_key = weather['api_key']
    if (api_key):
        return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + weather.get('lat') + '&lon=' + weather.get('lon') +'&units=' + weather.get('units') + '&exclude=minutely,hourly&appid=' + api_key)
    else:
        print('Open Weather Map API key (' + weather.get('env_var') + ') is not defined in environment variables.')
        exit(1)
        return

def get_weather_icon(weather_id):
    # ID definitions: https://openweathermap.org/weather-conditions
    if (weather_id == 800):
        return 'python/assets/icons/clear.png'
    elif (weather_id >= 300 and weather_id < 400):
        return 'python/assets/icons/drizzle.png'
    elif (weather_id >= 500 and weather_id < 600):
        return 'python/assets/icons/rain.png'
    elif (weather_id == 801 or weather_id == 802):  # 11-50% clouds
        return 'python/assets/icons/partly-cloudy.png'
    elif (weather_id >= 800 and weather_id < 900):
        return 'python/assets/icons/cloudy.png'   # 50%+ clouds
    elif (weather_id >= 210 and weather_id <= 221):
        return 'python/assets/icons/thunderstorm.png'
    elif (weather_id >= 200 and weather_id < 300):
        return 'python/assets/icons/rain-thunderstorm.png'
    elif (weather_id == 600 or weather_id == 620):
        return 'python/assets/icons/light-snow.png'
    elif ((weather_id >= 611 and weather_id <= 613) or weather_id == 511):
        return 'python/assets/icons/sleet.png'
    elif (weather_id == 615 or weather_id == 616):
        return 'python/assets/icons/rain-snow.png'
    elif (weather_id == 602):
        return 'python/assets/icons/heavy-snow.png'
    elif (weather_id >= 600 and weather_id < 700):
        return 'python/assets/icons/snow.png'
    elif (weather_id == 781):
        return 'python/assets/icons/tornado.png'
    elif (weather_id >= 700 and weather_id < 800):
        return 'python/assets/icons/atmosphere.png'
    else:
        return 'python/assets/icons/unknown.png'
        # 701	Mist	mist	 50d
        # 711	Smoke	Smoke	 50d
        # 721	Haze	Haze	 50d
        # 731	Dust	sand/ dust whirls	 50d
        # 741	Fog	fog	 50d
        # 751	Sand	sand	 50d
        # 761	Dust	dust	 50d
        # 762	Ash	volcanic ash	 50d
        # 771	Squall	squalls	 50d

def get_forecast(json, weather):
    for i in range(1,4):
        day = json[i]
        weather_id = day['weather'][0]['id']
        data = WeatherDay()
        data.icon = get_weather_icon(weather_id) # Weather icon for forecasted day
        data.day = get_day_of_week_from_ms(day['dt'])[0:3] # Day of week 3-letter abbreviation
        data.temps = str(round(day['temp']['max'])) + '° | ' + str(round(day['temp']['min'])) + '°' # High and low for forecasted day 
        weather.add_forecasted_day(data)