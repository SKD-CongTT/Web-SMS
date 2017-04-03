from pprint import pprint
from Crypto.Random import random
import requests, json, names

DEFAULT_MAJOR = 'Computer Science'
DEFAULT_BIO = 'Love computer, playing games. Hardworking. Smart learner.'

session = requests.session()
url = 'http://localhost:8000/'
params = {'format':'json'}
headers = {}

def generate_student(sid, major=DEFAULT_MAJOR, bio=DEFAULT_BIO):
    return {
        "first_name": names.get_first_name(),
        "last_name": names.get_last_name(),
        "username": sid,
        "password": sid,
        "email": sid + '@student.hust.edu.vn',
        "major": major,
        "bio": bio,
        "type": random.randint(0,1)
    }

def login():
    global headers
    api = 'auth/token/obtain/'
    data = {'username':'root', 'password':'nghia123'}
    r = session.post(url + api, params=params, data=data)
    headers = {'Authorization' : 'JWT ' + json.loads(r.content)['token']}

def get(api):
    r = session.get(url + api, params=params, headers=headers)
    try:
        pprint(json.loads(r.content))
    except:
        print r.content
def post(api, data):
    r = session.post(url + api, params=params, data=data, headers=headers)
    try:
        pprint(json.loads(r.content))
    except:
        print r.content


if __name__ == '__main__':
    login()

    post('courses/', {'course_name':'Math I', 'description':'Abtract Algebra'})
    post('courses/', {'course_name':'Physic I', 'description':'Mechanical + Wave'})
    post('courses/', {'course_name':'C Intro', 'description':'Basic C Programming Syntaxes'})
    get('courses/')

    for i in range(100):
        post('students/', generate_student('2014%04d' % i))
    get('students/')
