import logging

from settings import NewsSettings
from shared import FONT_MD, FONT_MD_SIZE, PADDING, COL_2_X, COL_2_Y, WOTD_START
from util_fetch import fetch
from util_formatting import print_md_text_in_coord


def get_nytimes_headlines(settings: NewsSettings):
  results = fetch_nytimes_data(settings)
  if results is None:
    return None

  error = results.get('fault')
  if (error):
    logging.error(error['detail']['errorcode'] + ' ' + error['faultstring'])
    return None
  else:
    num = min([results['num_results'], settings.num])
    headlines = get_headlines(results['results'], num)
    return headlines


def fetch_nytimes_data(settings: NewsSettings):
  return fetch(
      'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' +
      settings.nytimes_api_key)


def get_newsapi_headlines(settings: NewsSettings):
  results = fetch_newsapi_headlines(settings)

  if results is None:
    return None

  if (results):
    if (results['status'] == 'error'):
      logging.error(results['code'] + ' ' + results['message'])
      exit(2)
    elif (results.get('totalResults') == 0):
      logging.info(
          'No news results returned for "' +
          settings.source +
          '". Source should be "nytimes" or any source ID from Newsapi (https://newsapi.org/docs/endpoints/sources).')
      return []
    elif (results['status'] == 'ok'):
      num = min([results['totalResults'], settings.num])
      return get_headlines(results['articles'], num)
  else:
    return []


def fetch_newsapi_headlines(settings: NewsSettings):
  return fetch(
      'https://newsapi.org/v2/top-headlines' +
      '?sources=' + settings.source +
      '&apiKey=' + settings.newsapi_api_key)


def get_headlines(articles, num):
  news = []
  for i in range(num):
    news.append(articles[i]['title'])
  return news


def get_news_headlines(settings: NewsSettings):
  if (settings.source == 'nytimes'):
    return get_nytimes_headlines(settings)
  else:
    return get_newsapi_headlines(settings)


def print_news_data(settings: NewsSettings, draw):
  news_data = get_news_headlines(settings)

  if news_data is not None:
    y = COL_2_Y + 98
    buffer = 2

    # Print bulleted list
    for headline in news_data:
      # Only print items while there's space for text above the WOTD section
      if (y >= WOTD_START - FONT_MD_SIZE - buffer):
        break
      draw.text((COL_2_X, y), '•', font=FONT_MD, fill=0)
      y = print_md_text_in_coord(draw, COL_2_X + PADDING, y, headline, WOTD_START) + buffer
  else:
    logging.warning('News data was not retrieved.')
