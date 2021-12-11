from datetime import datetime
from config import font_md, font_lg, font_italic_sm, today_x, today_y

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
    if (date.month == 3 and date.day == 19):
        print('Happy birthday!')
    return get_day_of_week(date) + ', \n' + date.strftime('%B %-d')

def get_current_date_time():
    date = datetime.now()
    return date.strftime('%b %-d, %-I:%M:%S %p')

def print_current_date():
    print(get_current_date())

# Print last updated date + time in bottom right of screen
def print_last_updated(draw, display_w, display_h):
    last_updated = 'Last updated ' + get_current_date_time()
    width, height = font_italic_sm.getsize(last_updated)
    draw.text((display_w - width, display_h - height), last_updated, font = font_italic_sm, fill = 0)
    return last_updated

# Print day of the week and date in designated space
def print_todays_date(draw):   
    day_and_date = get_current_date().split('\n')
    draw.text((today_x, today_y), day_and_date[0], font = font_md, fill = 0)
    draw.text((today_x, today_y+22), day_and_date[1], font = font_lg, fill = 0)