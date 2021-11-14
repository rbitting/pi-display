from config import dictionary
from util import fetch

def print_word_of_the_day():
    results = get_word_of_the_day()
    error = results.get('message')
    if (error):
        print(error)
    else:
        print(capitalize_first_letter(results['word']))
        print(results['definitions'][0]['text'])
        

def get_word_of_the_day():
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