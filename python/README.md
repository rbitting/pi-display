# Pi Display - Back End

Information to display on an e-ink display powered by a Raspberry Pi.

## Prerequisites

1. [Python 3.7+](https://www.python.org/downloads/)
1. [Node.js](https://nodejs.org/)
1. [Fast CLI](https://github.com/sindresorhus/fast-cli) cli (`npm install --global fast-cli`)
1. Create API keys for all the data modules listed below that you want to utilize.
    * Weather: [OpenWeatherMap API](https://openweathermap.org/api/one-call-api)
    * Crypto prices: [CoinMarketCap API](https://coinmarketcap.com/api/documentation/v1/)
    * News: [New York Times API](https://developer.nytimes.com/)
    * Word of the day: [Wordnik API](https://developer.wordnik.com/)
1. Set your environment variables in a `.env` file within the `/python` directory (note that the IP address for your Pi-Hole also needs to be stored):
    ```
    export OWM_API_KEY=[open_weather_map_key]
    export CMC_API_KEY=[coinmarketcap_key]
    export NYTIMES_API_KEY=[nytimes_api_key]
    export WORDNIK_API_KEY=[wordnik_api_key]
    export PIHOLE_ADDRESS=[ip_address_for_your_pihole]
    ```
1. You may need to also install the python-dotenv python dependency: `pip install python-dotenv`

This project was specificially built for the [Waveshare 5.83inch e-Paper HAT](https://www.waveshare.com/wiki/5.83inch_e-Paper_HAT).

## Configuration

Some module settings can be set in the `src/config.py` file. Use this file to enable/disable various data modules and adjust their settings. Default is all enabled.

## Run

To run the python program to retrieve and print the display data, run the command `python3 -m python.main` from the root folder.

## Data Modules

The information displayed is optained from the folowing sources.

### OpenWeatherMap

Weather data is retrieved from the [OpenWeatherMap one call API](https://openweathermap.org/api/one-call-api). It includes current temperature, 3-day forecast, sunrise/sunset, and weather description (used to generate weather icon). Your OpenWeatherMap API key needs to be set in the OWM_API_KEY environment variable in order for this functionality to work. Default location is Philadelphia, PA.

#### Configuration Options

* `enabled`: Boolean to declare whether to get and display the weather information
* `lat`: Latitude for the weather location
* `lon`: Longitude for the weather location

### Pi-Hole

The Pi-Hole status information is retrieved from the local [Pi-Hole API](https://discourse.pi-hole.net/t/pi-hole-api/1863). It includes current status (enabled/disabled), number of queries blocked, and percentage of queries blocked. Your Pi-Hole's IP address needs to be set in the PIHOLE_ADDRESS environment variable in order for this functionality to work.

#### Configuration Options

* `enabled`: Boolean to declare whether to get and display the Pi-Hole information

### CoinMarketCap

Cypto prices are retrieved from the [CoinMarketCap API](https://coinmarketcap.com/api/documentation/v1/). Your CoinMarketCap API key needs to be set in the CMC_API_KEY environment variable in order for this functionality to work.

#### Configuration Options

* `enabled`: Boolean to declare whether to get and display cryptocurrency prices
* `tokens`: Array of coins/tokens to retrieve values for
* `currency`: Currency to display prices in (ex. USD, GBP, etc.)

### Wordnik

[Wordnik](https://developer.wordnik.com/) is used to get the word of the day definition. Your Wordnik API key needs to be set in the WORDNIK_API_KEY environment variable in order for this functionality to work.

#### Configuration Options

* `enabled`: Boolean to declare whether to get and display the word of the day

### Fast CLI

Network speed information is run in local speed tests via the Fast CLI.

#### Configuration Options

* `enabled`: Boolean to declare whether to calculate and display the network speed

### News

The source for news headlines is set in the `config.py`. News can either be fetched from the New York Times API or News API. Set the `source` to `'nytimes'` to use the NY Times API or any [source ID from News API](https://newsapi.org/docs/endpoints/sources) to use the News API (ex. `'the-washington-post'`). 

#### New York Times API

News headlines can be retrieved from the [New York Times API](https://developer.nytimes.com/). Your NYTimes API key needs to be set in the NYTIMES_API_KEY environment variable in order for this functionality to work.

#### News API

News headlines can also be retrieved from the [News API](https://newsapi.org/). Your News API key needs to be set in the NEWSAPI_API_KEY environment variable in order for this functionality to work. Note: Articles are delayed a hour if you are using the free version.

#### Configuration Options

* `enabled`: Boolean to declare whether to get and display news headlines
* `source`: Source for the articles. Can be 'nytimes' or any [source ID from News API](https://newsapi.org/docs/endpoints/sources)
* `num`: Number of headlines to display

## Icons

Icons are from [Icons8](https://icons8.com).
