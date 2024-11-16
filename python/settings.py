import logging
from dataclasses import dataclass
from enum import Enum
from typing import List
from dataclass_wizard import JSONWizard
from dotenv import load_dotenv
from PIL import ImageFont

from util_os import EnvVariable, get_env_var_value

load_dotenv()


class WeatherUnit(Enum):
  IMPERIAL = 'imperial'
  METRIC = 'metric'
  STANDARD = 'standard'


@dataclass
class GoogleCalendarSettings(JSONWizard):
  enabled: bool
  cal_id: str = get_env_var_value(EnvVariable.GCAL)


@dataclass
class NetworkSettings(JSONWizard):
  enabled: bool


@dataclass
class NewsSettings(JSONWizard):
  enabled: bool
  # The maximum number of headlines to display
  num: int
  # Determines the source for the news headlines
  # Can be 'nytimes' or any source ID from newsapi list: https://newsapi.org/docs/endpoints/sources
  # If set to 'nytimes', the nytimes ApiSetting is required
  # Otherwise the newsapi ApiSetting is required
  source: str
  nytimes_api_key: str = get_env_var_value(EnvVariable.NYTIMES)
  newsapi_api_key: str = get_env_var_value(EnvVariable.NEWSAPI)


@dataclass
class PiholeSettings(JSONWizard):
  enabled: bool
  ip: str = get_env_var_value(EnvVariable.PIHOLE_IP)


@dataclass
class SeptaRoute(JSONWizard):
  route_number: str
  stop_id: str


@dataclass
class SeptaSettings(JSONWizard):
  enabled: bool
  num: int
  routes: List[SeptaRoute]


@dataclass
class WeatherSettings(JSONWizard):
  enabled: bool
  lat: str
  lon: str
  units: WeatherUnit
  api_key: str = get_env_var_value(EnvVariable.WEATHER)


@dataclass
class WordOfTheDaySettings(JSONWizard):
  enabled: bool
  api_key: str = get_env_var_value(EnvVariable.WORDNIK)


@dataclass
class Settings(JSONWizard):
  google_cal: GoogleCalendarSettings
  network: NetworkSettings
  news: NewsSettings
  pihole: PiholeSettings
  septa: SeptaSettings
  weather: WeatherSettings
  word_of_the_day: WordOfTheDaySettings


def get_app_settings() -> Settings:
  settings_file_path = '../settings.json'
  try:
    with open(settings_file_path) as f:
      settings_json = f.read()
      settings = Settings.from_json(settings_json)
      validate_settings(settings)
      return settings
  except Exception as e:
    logging.error('Could not get app settings')
    raise e


def save_app_settings(settings: Settings):
  settings_file_path = '../settings.json'
  try:
    with open(settings_file_path) as f:
      f.write(settings.to_json())
  except Exception as e:
    logging.error('Could not save app settings: ', e)


def is_null_or_whitespace(value: str):
  return value is None or not value.strip()


def new_invalid_env_var_exception(setting_name: EnvVariable, value: str):
  return Exception(f'Invalid environment variable set for {setting_name}: {value}')


def validate_settings(settings: Settings):
  # Verify Google Calendar id is set if Google Calendar is enabled
  if settings.google_cal.enabled:
    cal_id: str = settings.google_cal.cal_id
    if is_null_or_whitespace(cal_id):
      raise new_invalid_env_var_exception(EnvVariable.GCAL, cal_id)

  # Verify API key for applicable news source is set if news is enabled
  if settings.news.enabled:
    if settings.news.source == 'nytimes':
      api_key: str = settings.news.nytimes_api_key
      if is_null_or_whitespace(api_key):
        raise new_invalid_env_var_exception(EnvVariable.NYTIMES, api_key)
    else:
      api_key: str = settings.news.newsapi_api_key
      if is_null_or_whitespace(api_key):
        raise new_invalid_env_var_exception(EnvVariable.NEWSAPI, api_key)

  # Verify Pi-Hole IP address is set if Pi-Hole status is enabled
  if settings.pihole.enabled:
    ip_address: str = settings.pihole.ip
    if is_null_or_whitespace(ip_address):
      raise new_invalid_env_var_exception(EnvVariable.PIHOLE_IP, ip_address)

  # Verify OpenWeatherMap API key is set if weather is enabled
  if settings.weather.enabled:
    api_key: str = settings.weather.api_key
    if is_null_or_whitespace(api_key):
      raise new_invalid_env_var_exception(EnvVariable.WEATHER, api_key)

  # Verify Wordnik API key is set if word of the day is enabled
  if settings.word_of_the_day.enabled:
    api_key: str = settings.word_of_the_day.api_key
    if is_null_or_whitespace(api_key):
      raise new_invalid_env_var_exception(EnvVariable.WORDNIK, api_key)
