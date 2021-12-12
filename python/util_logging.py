import logging
from util_os import get_home_dir, mkdir, path_exists

# Logs are saved in 'logs' folder in home directory
LOG_DIR = get_home_dir() + '/logs'
LOG_FILE = LOG_DIR + '/main.log'

def set_logging_config():
    if (not path_exists(LOG_DIR)):
        mkdir(LOG_DIR)
    logging.basicConfig(
        level=logging.INFO, 
        filename=LOG_FILE, 
        encoding='utf-8', 
        format='[%(levelname)s]%(asctime)s %(message)s', 
        datefmt='%m/%d/%Y %I:%M:%S %p')