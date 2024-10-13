import logging

from settings import WordOfTheDaySettings
from shared import COL_2_X, FONT_MD, DISPLAY_W, WOTD_START
from util_fetch import fetch
from util_formatting import print_sm_text_in_box, get_height_of_text, get_height_of_sm_multiline_text

class WordOfTheDay():
    def __init__(self):
        self.word = ""
        self.definition = ""
        self.word_type = ""

    @property
    def word(self):
        return self._word

    @word.setter
    def word(self, a):
        self._word = a

    @property
    def definition(self):
        return self._definition

    @definition.setter
    def definition(self, a):
        self._definition = a

    @property
    def word_type(self):
        return self._word_type

    @word_type.setter
    def word_type(self, a):
        # Reduce to abbreviation
        if a is None:
            a = ""
        elif (a == "adjective"):
            a = "adj."
        elif (a == "noun"):
            a = "n."
        elif (a == "verb"):
            a = "v."
        elif (a == "adverb"):
            a = "adv."
        elif (a == "pronoun"):
            a = "pron."
        elif (a == "preposition"):
            a = "prep."
        elif (a == "interjection"):
            a = "interj."
        self._word_type = '(' + a + ')'

def get_word_of_the_day(settings: WordOfTheDaySettings):
    results = fetch_word_of_the_day(settings)
    if results is None:
        return None
        
    error = results.get('message')
    if (error):
        logging.error(error)
        return None
    else:
        wotd = WordOfTheDay()
        wotd.word = capitalize_first_letter(results['word'])
        wotd.definition = results['definitions'][0]['text']
        wotd.word_type = results['definitions'][0]['partOfSpeech']
        return wotd


def fetch_word_of_the_day(settings: WordOfTheDaySettings):
    return fetch('https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=' + settings.api_key)

def capitalize_first_letter(word):
    chars = list(word)
    chars[0] = chars[0].upper()
    return ''.join(chars)

def print_word_of_the_day(settings: WordOfTheDaySettings, draw):
    wotd = get_word_of_the_day(settings)
    max_height_of_wotd = 92
    
    # Draw horizontal line
    draw.line((COL_2_X, WOTD_START, DISPLAY_W, WOTD_START), fill=0)

    if wotd is not None:
        wotd_str = 'Word of the Day: ' + wotd.word
        description = wotd.word_type + " " + wotd.definition
        
        height_title = get_height_of_text(FONT_MD, wotd_str)
        height_desc = get_height_of_sm_multiline_text(description)
        
        x = COL_2_X
        y = WOTD_START + ((max_height_of_wotd - (height_title + height_desc)) / 2)  # Center section vertically in wotd area
        draw.text((x, y), wotd_str, font=FONT_MD, fill=0)
        print_sm_text_in_box(draw, x, y + 24, description)
        logging.info(wotd_str)
    else:
        logging.warn('WOTD data was not retrieved.')
