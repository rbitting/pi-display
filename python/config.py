from dotenv import load_dotenv
from PIL import ImageFont

from epd5in83_V2 import EPD_HEIGHT, EPD_WIDTH
from util_os import get_absolute_path, get_env_var

load_dotenv()

WEATHER_ENV_VAR = 'OWM_API_KEY'
CRYPTO_ENV_VAR = 'CMC_API_KEY'
IP_ENV_VAR = 'PIHOLE_ADDRESS'
NYTIMES_ENV_VAR = 'NYTIMES_API_KEY'
WORDNIK_ENV_VAR = 'WORDNIK_API_KEY'
NEWSAPI_ENV_VAR = 'NEWSAPI_API_KEY'

# Weather
weather = {
    'enabled': True,
    'api_key': get_env_var(WEATHER_ENV_VAR),
    'env_var': WEATHER_ENV_VAR,
    'lon': '-75.175',
    'lat': '39.9656',
    'units': 'imperial'  # 'standard', 'metric' or 'imperial'
}


# Crypto
crypto = {
    'enabled': True,
    'api_key': get_env_var(CRYPTO_ENV_VAR),
    'env_var': CRYPTO_ENV_VAR,
    'tokens': ['BTC', 'ETH', 'ALGO', 'MANA', 'PAWTH'],
    'currency': 'USD'
}

# Pihole
pihole = {
    'enabled': True,
    'ip': get_env_var(IP_ENV_VAR),
    'env_var': IP_ENV_VAR
}

# Network Speed
network = {
    'enabled': True
}

# News
news = {
    'enabled': True,
    # 'nytimes' or any source ID from newsapi list: https://newsapi.org/docs/endpoints/sources
    'source': 'the-washington-post',
    'num': 3,
    'api_key': {
        'nytimes': get_env_var(NYTIMES_ENV_VAR),
        'newsapi': get_env_var(NEWSAPI_ENV_VAR)
    },
    'env_var': {
        'nytimes': NYTIMES_ENV_VAR,
        'newsapi': NEWSAPI_ENV_VAR
    }
}

# Word of the day via Wordnik
word_of_the_day = {
    'enabled': True,
    'api_key': get_env_var(WORDNIK_ENV_VAR),
    'env_var': WORDNIK_ENV_VAR
}

# Septa status

septa = {
    'enabled': True,
    'num': 3,
    'routes': [
        {
            'route': '48',
            'stop': '2863'    # 23rd & Green
        },
        {
            'route': '33',    # Bus route
            'stop': '2828'    # Stop ID - 20th & Green
        },
        {
            'route': '32',
            'stop': '16566'    # Penn & SG
        }
    ]
}

font_italic_sm = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Italic.ttf'), 18)
font_italic = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Italic.ttf'), 22)
font_sm = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), 16)
font_md = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), 22)
font_lg = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), 40)
icon_w = 50
icon_h = 50
icon_size_sm = 40
icon_size_xs = 22
padding = 10
padding_sm = padding / 2
padding_lg = padding * 2
col_1_w = 300
today_x = col_1_w + 30
today_y = 45
display_w = EPD_WIDTH
display_h = EPD_HEIGHT
