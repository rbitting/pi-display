from PIL import ImageFont
from epd5in83_V2 import EPD_HEIGHT, EPD_WIDTH
from util_os import get_absolute_path

FONT_SM_SIZE = 16
FONT_MD_SIZE = 22
FONT_LG_SIZE = 40
FONT_ITALIC_SM = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Italic.ttf'), FONT_SM_SIZE)
FONT_ITALIC = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Italic.ttf'), FONT_MD_SIZE)
FONT_SM = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), FONT_SM_SIZE)
FONT_MD = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), FONT_MD_SIZE)
FONT_LG = ImageFont.truetype(get_absolute_path('python/assets/fonts/Roboto-Regular.ttf'), FONT_LG_SIZE)
ICON_SIZE_SM = 40
ICON_SIZE_XS = 22
PADDING = 10
PADDING_SM = PADDING / 2
COL_1_W = 300   # Max width for first column
COL_2_X = COL_1_W + 20  # Horizontal start of 2nd column
COL_2_Y = 27    # Vertical start of 2nd column (date info)
DISPLAY_W = EPD_WIDTH
DISPLAY_H = EPD_HEIGHT
WOTD_START = DISPLAY_H - 110
