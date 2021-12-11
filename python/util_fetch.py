import json
import logging
import requests

def fetch(url):
    try:
        r = requests.get(url)
        return json.loads(r.text)
    except requests.exceptions.RequestException as e:
        logging.error('Could not fetch: ' + url)
        return

def fetch_with_headers_params(url, headers, params):
    try:
        r = requests.get(url, headers=headers, params=params)
        return json.loads(r.text)
    except requests.exceptions.RequestException as e:
        logging.error('Could not fetch with headers and params: ' + url)
        return
