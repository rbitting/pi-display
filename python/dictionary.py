from config import dictionary
from util import fetch
    
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
        if (a == "adjective"):
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

def get_word_of_the_day():
    results = fetch_word_of_the_day()
    error = results.get('message')
    if (error):
        print(error)
    else:
        wotd = WordOfTheDay()
        wotd.word = capitalize_first_letter(results['word'])
        wotd.definition = results['definitions'][0]['text']
        wotd.word_type = results['definitions'][0]['partOfSpeech']
        return wotd
        

def fetch_word_of_the_day():
    api_key = dictionary['api_key']
    if (api_key):
        return fetch('https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=' + api_key)
    else:
        print('Wordnik API key (' + dictionary.get('env_var') + ') is not defined in environment variables.')
        exit(1)

def capitalize_first_letter(word):
    chars = list(word)
    chars[0] = chars[0].upper()
    return ''.join(chars)