from util_fetch import fetch_with_headers_params
from config import crypto
from dict import currency_symbols

def print_crypto_prices():
    results = get_crypto_prices()
    if (results):
        error_code = results.get('status').get('error_code')
        if (error_code):
            print(str(error_code) + ' ' + results.get('status').get('error_message'))
            exit(2)
        else:
            currency = crypto.get('currency')
            for token in crypto.get('tokens'):
                price = results['data'][token]['quote'][currency]['price']
                num_format = '{:.2f}' # 2 decimal places
                if price < 1:
                    num_format = '{:.4f}' # Round to 4 decimal places if price is under a dollar
                print(token + ': ' + currency_symbols[currency] + str(num_format.format(price)))


def get_crypto_prices():
    api_key = crypto.get('api_key')
    if (api_key):
        headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': api_key
        }
        tokens_str = ''
        first = True
        for token in crypto.get('tokens'):
            if (not first):
                tokens_str += ','
            else:
                first = False

            tokens_str += token
        params = {
            'symbol': tokens_str,
            'convert': crypto.get('currency')
        }
        return fetch_with_headers_params('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', headers, params)
    else:
        print('CoinMarketCap API key (' + crypto.get('env_var') + ') is not defined in environment variables.')
        exit(1)
        return