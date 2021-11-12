from config import weather, crypto, pihole, network, news, dictionary
from modules.crypto import print_crypto_prices
from modules.dictionary import print_word_of_the_day
from modules.pihole import print_pihole_data
from modules.network import print_network_speed, print_network_name
from modules.news import print_news_headlines
from modules.util import print_current_date, get_current_date_time
from modules.weather import print_weather

print_network_name()

if (network['enabled']):
    print_network_speed()
    print('\n')

if (weather['enabled']):
    print_weather()
    print('\n')

if (pihole['enabled']):
    print_pihole_data()
    print('\n')

if (crypto['enabled']):
    print_crypto_prices()
    print('\n')
    
if (news['enabled']):
    print_news_headlines()
    print('\n')

if (dictionary['enabled']):
    print_word_of_the_day()
    print('\n')

print_current_date()
print('\n')

print('Last updated ' + get_current_date_time())