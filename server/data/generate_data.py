from pprint import pprint
import requests, json, students, courses, time

session = requests.session()
url = 'http://localhost:8000/'
params = {'format':'json'}
headers = {}

def login():
    global headers
    api = 'auth/token/obtain/'
    data = {'username':'root', 'password':'nghia123'}
    r = session.post(url + api, params=params, data=data)
    headers = {'Authorization' : 'JWT ' + json.loads(r.content)['token']}

def get(api):
    r = session.get(url + api, params=params, headers=headers)
    if r.status_code != 200:
        print r.content

def post(api, data):
    r = session.post(url + api, params=params, data=data, headers=headers)
    if r.status_code != 201:
        print r.content

if __name__ == '__main__':
    login()
    for course in courses.generate_courses():
        print course['description']
        post('courses/', course)

    for i in range(50):
        student = students.generate_student('2014%04d' % i)
        print student['first_name'] + ' ' + student['last_name']
        post('students/', student)
