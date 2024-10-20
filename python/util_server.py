import json
import logging
import requests

from util_fetch import fetch

status_endpoint = 'http://localhost:3000/api/display-status'


def send_status(isError, isProcessing, message):
  headers = {
      'Accepts': 'application/json',
      'Content-Type': 'application/json'
  }
  body = {
      'isError': isError,
      'isProcessing': isProcessing,
      'message': message
  }
  try:
    r = requests.post(status_endpoint, data=json.dumps(body), headers=headers)
    # logging.info(json.loads(r.text))
  except requests.exceptions.RequestException as e:
    logging.error('Could not send status update')
    logging.exception(e)
  except BaseException as e:
    logging.exception(e)


def get_server_status():
  return fetch(status_endpoint)


def is_display_busy() -> bool:
  server_status = get_server_status()
  if server_status is None:
    return False
  return server_status['isProcessing'] or server_status['isWaiting']
