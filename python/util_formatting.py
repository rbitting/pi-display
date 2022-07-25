import logging
import textwrap
from math import floor

from PIL import Image

from config import FONT_MD, FONT_MD_SIZE, FONT_SM, ICON_SIZE_SM, ICON_SIZE_XS


def get_width_of_text(font, text):
    width, height = font.getsize(text)
    return width


def get_height_of_text(font, text):
    width, height = font.getsize(text)
    return height


def get_small_icon(path):
    icon = Image.open(path)
    return icon.resize((ICON_SIZE_SM, ICON_SIZE_SM))


def get_xsmall_icon(path):
    icon = Image.open(path)
    return icon.resize((ICON_SIZE_XS, ICON_SIZE_XS))

# Prints text starting at x until y then jumps to next line
def print_md_text_in_coord(draw, x, y, text, max_y):
    # For some reason the real line height ends up being 25 instead of 22
    max_lines = floor((max_y - y) / (FONT_MD_SIZE + 3))
    logging.debug('y: ' + str(y) + ', max_y: ' + str(max_y) + ', max_lines = ' + str(max_lines))
    lines = textwrap.wrap(text, width=29, max_lines=max_lines, placeholder="...")
    for line in lines:
        width, height = FONT_MD.getsize(line)
        draw.text((x, y), line, font=FONT_MD, fill=0)
        y += height + 1
    return y


def get_sm_text_wrap(text):
    return textwrap.wrap(text, width=44, max_lines=3, placeholder="...")


def print_sm_text_in_box(draw, x, y, text):
    lines = get_sm_text_wrap(text)
    for line in lines:
        width, height = FONT_SM.getsize(line)
        draw.text((x, y), line, font=FONT_SM, fill=0)
        y += height


def get_height_of_sm_multiline_text(text):
    lines = get_sm_text_wrap(text)
    y = 0
    for line in lines:
        width, height = FONT_SM.getsize(line)
        y += height
    return y


def get_x_for_centered_text(text, font, x_start, x_end):
    width, height = font.getsize(text)
    return round((x_end - x_start)/2) - round(width/2) + x_start
