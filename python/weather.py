import logging
from PIL import Image

from config import (col_1_w, font_lg, font_md, font_sm, icon_size_sm, padding, padding_sm, weather)
from util_dates import get_day_of_week_from_ms, get_time_from_ms
from util_fetch import fetch
from util_formatting import get_small_icon
from util_os import get_absolute_path, path_exists
from weather_data import WeatherData, WeatherDay


def get_weather_data():
    results = fetch_weather_data()
    error_code = results.get('cod')
    if (error_code):
        logging.error(str(error_code) + ' ' + results.get('message'))
        exit(2)
    else:
        weather = WeatherData()
        current = results['current']
        weather_id = current['weather'][0]['id']

        weather.current_icon_id = str(weather_id)
        weather.current_icon = get_weather_icon(weather_id)  # Current weather icon
        # Current weather short description (ex. 'Clouds')
        weather.current_desc = current['weather'][0]['main']
        today_forecast = results['daily'][0]['temp']
        weather.current_temp = str(round(current['temp'])) + '°'
        weather.current = ('Feels Like: ' + str(round(current['feels_like'])) + '°\n' +  # Feels like temp
                           str(round(today_forecast['max'])) + '° | ' + str(round(today_forecast['min'])) + '°')  # Today's high and low
        weather.sunrise = get_time_from_ms(current['sunrise'] + results['timezone_offset'])
        weather.sunset = get_time_from_ms(current['sunset'] + results['timezone_offset'])
        get_forecast(results['daily'], weather)
        return weather

def fetch_weather_data():
    api_key = weather['api_key']
    if (api_key):
        return fetch(
            'https://api.openweathermap.org/data/2.5/onecall?lat=' +
            weather.get('lat') +
            '&lon=' +
            weather.get('lon') +
            '&units=' +
            weather.get('units') +
            '&exclude=minutely,hourly&appid=' +
            api_key)
    else:
        logging.error(
            'Open Weather Map API key (' +
            weather.get('env_var') +
            ') is not defined in environment variables.')
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
    for i in range(1, 4):
        day = json[i]
        weather_id = day['weather'][0]['id']
        data = WeatherDay()
        data.icon = get_weather_icon(weather_id)  # Weather icon for forecasted day
        data.day = get_day_of_week_from_ms(day['dt'])[0:3]  # Day of week 3-letter abbreviation
        data.temps = str(round(day['temp']['max'])) + '° | ' + \
            str(round(day['temp']['min'])) + '°'  # High and low for forecasted day
        weather.add_forecasted_day(data)

def print_weather(Himage, draw):
    weather_data = get_weather_data()
    weather_icon = get_absolute_path(weather_data.current_icon)
    if path_exists(weather_icon):
        Himage.paste(Image.open(weather_icon), (20, 15))   # Current weather icon
    else:
        logging.warning(
            'No icon for current weather: ' +
            weather_data.current_icon_id +
            ' ' +
            weather_data.current_desc)
    logging.info('current temp: ' + weather_data.current_temp)
    draw.text((80, 15), weather_data.current_temp, font=font_lg, fill=0)   # Current temperature
    draw.text((20, 65), weather_data.current, font=font_md, fill=0)    # Feels like temp + high/low

    x = 180
    y = 30
    Himage.paste(
        get_small_icon(
            get_absolute_path(
                weather_data.get_sunrise_icon())),
        (x,
         y))   # Sunrise icon
    draw.text((x + icon_size_sm + padding_sm, y + padding),
              weather_data.sunrise, font=font_md, fill=0)   # Sunrise time

    Himage.paste(get_small_icon(get_absolute_path(weather_data.get_sunset_icon())),
                 (x, y + icon_size_sm))   # Sunset icon
    draw.text((x + icon_size_sm + padding_sm, y + icon_size_sm + padding),
              weather_data.sunset, font=font_md, fill=0)   # Sunset time

    forecast = weather_data.get_forecast()
    y = 125  # Y coordinate (to display forecasts in a row)
    x = 20
    next_line = y + icon_size_sm

    for day in forecast:
        Himage.paste(get_small_icon(get_absolute_path(day.icon)),
                     (x, y))   # Forecasted weather icon
        draw.text((x + icon_size_sm + padding, y + padding_sm), day.day,
                  font=font_sm, fill=0)   # Day of week next to icon
        draw.text((x, next_line), day.temps, font=font_md, fill=0)   # High/low below
        x += (icon_size_sm + 60)

    y = 205
    draw.line((20, y, col_1_w, y), fill=0)
