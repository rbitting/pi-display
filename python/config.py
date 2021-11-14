import os

WEATHER_ENV_VAR = 'OWM_API_KEY'
CRYPTO_ENV_VAR = 'CMC_API_KEY'
IP_ENV_VAR = 'PIHOLE_ADDRESS'
NYTIMES_ENV_VAR = 'NYTIMES_API_KEY'
WORDNIK_ENV_VAR = 'WORDNIK_API_KEY'
NEWSAPI_ENV_VAR = 'NEWSAPI_API_KEY'

# Weather
weather = {
    'enabled': True,
    'api_key': os.environ.get(WEATHER_ENV_VAR),
    'env_var': WEATHER_ENV_VAR,
    'lon': '-75.175',
    'lat': '39.9656',
    'units': 'imperial' # 'standard', 'metric' or 'imperial'
}


# Crypto
crypto = {
    'enabled': True,
    'api_key': os.environ.get(CRYPTO_ENV_VAR),
    'env_var': CRYPTO_ENV_VAR,
    'tokens': ['BTC', 'ETH', 'ALGO', 'MANA', 'PAWTH'],
    'currency': 'USD'
}

# Pihole
pihole = {
    'enabled': True,
    'ip': os.environ.get(IP_ENV_VAR),
    'env_var': IP_ENV_VAR
}

# Network Speed
network = {
    'enabled': True
}

# News
news = {
    'enabled': True,
    'source': 'nytimes',    # 'nytimes' or any source ID from newsapi list: https://newsapi.org/docs/endpoints/sources
    'num': 3,  
    'api_key': {
        'nytimes': os.environ.get(NYTIMES_ENV_VAR),
        'newsapi': os.environ.get(NEWSAPI_ENV_VAR)
    },
    'env_var': {
        'nytimes': NYTIMES_ENV_VAR,
        'newsapi': NEWSAPI_ENV_VAR
    }
}

# Dictionary for word of the day
dictionary = {
    'enabled': True,
    'api_key': os.environ.get(WORDNIK_ENV_VAR),
    'env_var': WORDNIK_ENV_VAR
}

# Septa status

septa = {
    'enabled': True,
    'num': 2,
    'routes': [
        {
            'route': '33',    # Bus route
            'stop': '2828'    # Stop ID - 20th & Green    
        },
        {
            'route': '48',
            'stop': '2863'    # 23rd & Green
        }
    ]
}