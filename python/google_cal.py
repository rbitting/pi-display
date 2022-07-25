from datetime import datetime
import logging

from googleapiclient.discovery import build

from config import COL_2_X, COL_2_Y, FONT_SM, google_cal
from util_gcal import get_gcal_creds


def get_gcal_data(gcal_id):
    logging.info('Starting gcal fetch...')
    try:
        creds = get_gcal_creds()
        service = build('calendar', 'v3', credentials=creds)
        
        # Format start and end dates
        timezone_offset = 5 # EST 
        rightnow = datetime.utcnow()
        corrected_hour = rightnow.hour + timezone_offset
        if (corrected_hour > 23):
            corrected_hour -= 24
        now = rightnow.replace(hour=corrected_hour)
        now_str = now.isoformat() + 'Z'  # 'Z' indicates UTC time
        eod = now.replace(day=(now.day+1), hour=timezone_offset, minute=0, second=0, microsecond=0)
        eod_str = eod.isoformat() + 'Z'
        logging.info("Google calendar - Start: " + now_str + ", End: " + eod_str)

        # Call the Calendar API
        events_result = service.events().list(calendarId=gcal_id, 
                                            timeMin=now_str, timeMax=eod_str,
                                            maxResults=1, singleEvents=True,
                                            orderBy='startTime').execute()
        events = events_result.get('items', [])

        if not events:
            return None

        event = events[0]   # Next upcoming event
        time = ''

        # Check if event has a start time (all day events only have 'date' key)
        if 'dateTime' in event['start']:
            time = datetime.strptime(event['start']['dateTime'], '%Y-%m-%dT%H:%M:%S%z').strftime(' @ %-I:%M%p').lower()

        # Return first event name and time (if applicable)
        return event['summary'] + time

    except BaseException as e:
        logging.exception(str(e))
        return None

def get_gcal_events():
    cal_id = google_cal['cal_id']
    if (not cal_id):
        logging.error('Google calendar id is required.')
        return None
    else:
        return get_gcal_data(cal_id)

def print_gcal_event(draw):
    event_name = get_gcal_events()
    if event_name is not None:
        logging.info('Google calendar result: ' + event_name)
        y = COL_2_Y + 68
        draw.text((COL_2_X, y), event_name, font=FONT_SM, fill=0)
    else:
        logging.info('No Google Calendar event found.')
