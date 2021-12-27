import textwrap

from PIL import Image

from config import font_md, font_sm, icon_size_sm, icon_size_xs


def get_width_of_text(font, text):
    width, height = font.getsize(text)
    return width
    
def get_height_of_text(font, text):
    width, height = font.getsize(text)
    return height

def get_small_icon(path):
    icon = Image.open(path)
    return icon.resize((icon_size_sm, icon_size_sm))
    
def get_xsmall_icon(path):
    icon = Image.open(path)
    return icon.resize((icon_size_xs, icon_size_xs))

def print_md_text_in_box(draw, x, y, text):
    lines = textwrap.wrap(text, width=30, max_lines=3, placeholder="...")
    for line in lines:
        width, height = font_md.getsize(line)
        draw.text((x, y), line, font=font_md, fill=0)
        y += height
    return y

def get_sm_text_wrap(text):
    return textwrap.wrap(text, width=45, max_lines=3, placeholder="...")

def print_sm_text_in_box(draw, x, y, text):
    lines = get_sm_text_wrap(text)
    for line in lines:
        width, height = font_sm.getsize(line)
        draw.text((x, y), line, font=font_sm, fill=0)
        y += height
    return y

def get_height_of_sm_multiline_text(text):
    lines = get_sm_text_wrap(text)
    y = 0
    for line in lines:
        width, height = font_sm.getsize(line)
        y += height
    return y
