import datetime
import logging
import pickle

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from config import COL_2_X, COL_2_Y, FONT_SM, google_cal
from util_os import get_absolute_path, path_exists

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']


def get_gcal_data(gcal_id):
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    token_file = get_absolute_path('python/token.pickle')
    if path_exists(token_file):
        with open(token_file, 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            logging.info("Google calendar credentials are invalid. Attempting refresh...")
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(get_absolute_path('python/credentials.json'), SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(get_absolute_path(token_file), 'wb') as token:
            pickle.dump(creds, token)

    try:
        service = build('calendar', 'v3', credentials=creds)

        # Call the Calendar API
        now = datetime.datetime.utcnow()
        now_str = now.isoformat() + 'Z'  # 'Z' indicates UTC time
        eod = now.replace(day=(now.day+1), hour=0, minute=0, second=0, microsecond=0)
        eod_str = eod.isoformat() + 'Z'
        logging.info("Google calendar - id: " + gcal_id + ", Start: " + now_str + ", End: " + eod_str)
        events_result = service.events().list(calendarId=gcal_id, 
                                              timeMin=now_str, timeMax=eod_str,
                                              maxResults=1, singleEvents=True,
                                              orderBy='startTime').execute()
        events = events_result.get('items', [])

        if not events:
            return None

        # Return first event name
        return events[0]['summary']

    except HttpError as error:
        print('An error occurred: %s' % error)

def get_gcal_events():
    cal_id = google_cal['cal_id']
    if (not cal_id):
        logging.error('Google calendar id is required.')
        return None
    else:
        return get_gcal_data(cal_id)

def print_gcal_event(draw):
    event_name = get_gcal_events()
    y = COL_2_Y + 65
    draw.text((COL_2_X, y), event_name, font=FONT_SM, fill=0)
