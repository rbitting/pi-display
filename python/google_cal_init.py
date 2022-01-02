from util_gcal import get_gcal_creds, is_credential_valid
from util_logging import set_logging_config

set_logging_config()

creds = get_gcal_creds()

if is_credential_valid(creds):
    print('Credentials successfully initialized.')