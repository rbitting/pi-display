from enum import Enum
import os


class EnvVariable(Enum):
  GCAL = 'GOOGLE_CALENDAR_ID'
  NEWSAPI = 'NEWSAPI_API_KEY'
  NYTIMES = 'NYTIMES_API_KEY'
  PIHOLE_IP = 'PIHOLE_ADDRESS'
  WEATHER = 'OWM_API_KEY'
  WORDNIK = 'WORDNIK_API_KEY'


def get_absolute_path(file_path):
  return os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), file_path)


def path_exists(file_path):
  return os.path.exists(file_path)


def get_env_var_value(var: EnvVariable):
  return os.environ.get(var)


def mkdir(file_path):
  os.mkdir(file_path)


def get_home_dir():
  return os.path.expanduser('~')


def get_current_dir():
  return os.getcwd().split('\\')[-1]
