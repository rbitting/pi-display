import logging
from util_dates import get_current_short_date_time
from util_os import get_home_dir, mkdir, path_exists

def get_log_name():
    # Log by day. Ex. 20220203_main.log
    return get_current_short_date_time() + '_main.log'

# Logs are saved in 'logs' folder in home directory
LOG_DIR = get_home_dir() + '/logs'
LOG_FILE = LOG_DIR + '/' + get_log_name()

def set_logging_config():
    if (not path_exists(LOG_DIR)):
        mkdir(LOG_DIR)
    logging.basicConfig(
        level=logging.INFO, 
        filename=LOG_FILE, 
        encoding='utf-8', 
        format='[%(levelname)s]%(asctime)s %(message)s', 
        datefmt='%m/%d/%Y %I:%M:%S %p')
