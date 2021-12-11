import textwrap

from PIL import Image

from config import font_md, font_sm, icon_size_sm

def get_small_icon(path):
    icon = Image.open(path)
    return icon.resize((icon_size_sm, icon_size_sm))

def print_md_text_in_box(draw, x, y, text):
    lines = textwrap.wrap(text, width=30, max_lines=3, placeholder="...")
    for line in lines:
        width, height = font_md.getsize(line)
        draw.text((x, y), line, font=font_md, fill=0)
        y += height
    return y

def print_sm_text_in_box(draw, x, y, text):
    lines = textwrap.wrap(text, width=45, max_lines=2, placeholder="...")
    for line in lines:
        width, height = font_sm.getsize(line)
        draw.text((x, y), line, font=font_sm, fill=0)
        y += height
    return y
