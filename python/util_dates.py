from datetime import datetime
import logging

from shared import FONT_ITALIC_SM, FONT_LG, FONT_MD, COL_2_X, COL_2_Y

day_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

def get_day_of_week_from_ms(ms):
    date = get_date_from_ms(ms)
    return get_day_of_week(date)

def get_time_from_ms(ms):
    date = get_date_from_ms(ms)
    return date.strftime('%-I:%M %p')

def get_date_from_ms(ms):
    return datetime.utcfromtimestamp(ms)

def get_day_of_week(date):
    return day_of_week[date.weekday()]

def get_current_date():
    date = datetime.today()
    return get_day_of_week(date) + ', \n' + date.strftime('%B %-d, %Y')

def get_current_date_time():
    date = datetime.now()
    return date.strftime('%b %-d, %-I:%M:%S %p')

def get_current_short_date_time():
    date = datetime.now()
    return date.strftime('%Y%m%d') # yyyymmdd

def print_current_date():
    logging.info(get_current_date())

# Print last updated date + time in bottom right of screen
def print_last_updated(draw, DISPLAY_W, DISPLAY_H):
    last_updated = 'Last updated ' + get_current_date_time()
    width, height = FONT_ITALIC_SM.getsize(last_updated)
    draw.text((DISPLAY_W - width - 20, DISPLAY_H - height), last_updated, font=FONT_ITALIC_SM, fill=0)
    return last_updated

# Print day of the week and date in designated space
def print_todays_date(draw):
    day_and_date = get_current_date().split('\n')
    draw.text((COL_2_X, COL_2_Y), day_and_date[0], font=FONT_MD, fill=0)
    draw.text((COL_2_X, COL_2_Y + 22), day_and_date[1], font=FONT_LG, fill=0)
