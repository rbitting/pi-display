from .util import fetch
from .config import news

def get_nytimes_headlines():
    results = fetch_nytimes_data()
    error = results.get('fault')
    if (error):
        print(error['detail']['errorcode'] + ' ' + error['faultstring'])
        exit(2)
    else:
        #print('/assets/icons/news.png')
        num = min([results['num_results'], news['num']])
        headlines = get_headlines(results['results'], num)
        return headlines

def fetch_nytimes_data():
    api_key = news.get('api_key').get('nytimes')
    if (api_key):
        return fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + api_key)
    else:
        print('New York Times API key (' + news.get('env_var').get('nytimes') + ') is not defined in environment variables.')
        exit(1)

def get_newsapi_headlines(source):
    results = fetch_newsapi_headlines(source)
    if (results):
        if (results['status'] == 'error'):
            print(results['code'] + ' ' + results['message'])
            exit(2)
        elif (results.get('totalResults') == 0):
            print('No news results returned for "' + source + '". Source should be "nytimes" or any source ID from Newsapi (https://newsapi.org/docs/endpoints/sources).')
            return []
        elif (results['status'] == 'ok'):
            num = min([results['totalResults'], news['num']])
            return get_headlines(results['articles'], num)
    else:
        return []

def fetch_newsapi_headlines(source):
    api_key = news.get('api_key').get('newsapi')
    if (api_key):
        return fetch('https://newsapi.org/v2/top-headlines?sources=' + source + '&apiKey=' + api_key)
    else:
        print('Newsapi.org API key (' + news.get('env_var').get('newsapi') + ') is not defined in environment variables.')
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