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
GCAL_ENV_VAR = 'GOOGLE_CALENDAR_ID'

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
    'enabled': False,
    'api_key': get_env_var(CRYPTO_ENV_VAR),
    'env_var': CRYPTO_ENV_VAR,
    'tokens': ['BTC', 'ETH'],
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
    'enabled': False
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

google_cal = {
    'enabled': True,
    'cal_id': get_env_var(GCAL_ENV_VAR)
}

FONT_ITALIC_SM = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Italic.ttf'), 18)
FONT_ITALIC = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Italic.ttf'), 22)
FONT_SM = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), 16)
FONT_MD = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), 22)
FONT_LG = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), 40)
ICON_SIZE_SM = 40
ICON_SIZE_XS = 22
PADDING = 10
PADDING_SM = PADDING / 2
COL_1_W = 300   # Max width for first column
COL_2_X = COL_1_W + 30  # Horizontal start of 2nd column
COL_2_Y = 27    # Vertical start of 2nd column (date info)
DISPLAY_W = EPD_WIDTH
DISPLAY_H = EPD_HEIGHT
