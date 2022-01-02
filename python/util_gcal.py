import logging
import pickle

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.errors import HttpError

from util_os import get_absolute_path, path_exists, get_current_dir

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

def get_gcal_creds():
    creds = None
    try:
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        token_filename = 'python/token.pickle'
        creds_path = 'python/credentials.json'

        token_file = get_absolute_path(token_filename)

        if path_exists(token_file):
            with open(token_file, 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                logging.info("Google calendar credentials are invalid. Attempting refresh...")
                creds.refresh(Request())
            else:
                creds_file = get_absolute_path(creds_path)
                if path_exists(creds_file):
                    flow = InstalledAppFlow.from_client_secrets_file(get_absolute_path(creds_file), SCOPES)
                    creds = flow.run_local_server(port=0)
                else:
                    error_msg = 'Credentials file (' + creds_file + ') is missing. Download and save your credentials files from the Google Cloud Console to this directory.'
                    print(error_msg)
                    logging.error(error_msg)
                    return None
            # Save the credentials for the next run
            with open(get_absolute_path(token_file), 'wb') as token:
                pickle.dump(creds, token)
    
    except HttpError as error:
        logging.exception('Could not get Google Calendar credentials')
        
    except BaseException as e:
        logging.exception(str(e))
        
    return creds

def is_credential_valid(creds):
    if creds is None:
        return False
    return not creds.expired and creds.valid