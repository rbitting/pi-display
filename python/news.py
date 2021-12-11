import logging

from config import font_md, news, padding, padding_sm, today_x, today_y
from util_fetch import fetch
from util_formatting import print_md_text_in_box


def get_nytimes_headlines():
    results = fetch_nytimes_data()
    error = results.get('fault')
    if (error):
        logging.error(error['detail']['errorcode'] + ' ' + error['faultstring'])
        exit(2)
    else:
        # logging.info('/assets/icons/news.png')
        num = min([results['num_results'], news['num']])
        headlines = get_headlines(results['results'], num)
        return headlines

def fetch_nytimes_data():
    api_key = news.get('api_key').get('nytimes')
    if (api_key):
        return fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + api_key)
    else:
        logging.error(
            'New York Times API key (' +
            news.get('env_var').get('nytimes') +
            ') is not defined in environment variables.')
        exit(1)

def get_newsapi_headlines(source):
    results = fetch_newsapi_headlines(source)
    if (results):
        if (results['status'] == 'error'):
            logging.error(results['code'] + ' ' + results['message'])
            exit(2)
        elif (results.get('totalResults') == 0):
            logging.info(
                'No news results returned for "' +
                source +
                '". Source should be "nytimes" or any source ID from Newsapi (https://newsapi.org/docs/endpoints/sources).')
            return []
        elif (results['status'] == 'ok'):
            num = min([results['totalResults'], news['num']])
            return get_headlines(results['articles'], num)
    else:
        return []

def fetch_newsapi_headlines(source):
    api_key = news.get('api_key').get('newsapi')
    if (api_key):
        return fetch(
            'https://newsapi.org/v2/top-headlines?sources=' +
            source +
            '&apiKey=' +
            api_key)
    else:
        logging.error(
            'Newsapi.org API key (' +
            news.get('env_var').get('newsapi') +
            ') is not defined in environment variables.')
        exit(1)
        return

def get_headlines(articles, num):
    news = []
    for i in range(num):
        news.append(articles[i]['title'])
    return news

def get_news_headlines():
    source = news['source']
    if (source == 'nytimes'):
        return get_nytimes_headlines()
    else:
        return get_newsapi_headlines(source)

def print_news_data(draw):
    news_data = get_news_headlines()
    y = today_y + 80
    for headline in news_data:
        draw.text((today_x, y), '•', font=font_md, fill=0)
        y = print_md_text_in_box(draw, today_x + padding, y, headline) + padding_sm
