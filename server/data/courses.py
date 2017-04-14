# -*- coding:utf8 -*- #
from pprint import pprint
import re, time

FIELDS = ['order', 'id', 'name', 'cost', 'score']
pattern = r'^(?P<order>\d+)\s+(?P<id>\w+)\s+(?P<name>[^\d]+)\s+(?P<cost>\d+).*$'

def extract_basic_courses_info():
    courses = []
    for line in open('courses.txt').read().split('\n'):
        match = re.match(pattern, line)
        if match:
            data = match.groupdict()
            data['order'] = int(data['order'])
            data['cost'] = int(data['cost'])
            courses.append(data)
    return courses

def calculate_one_course_requirement(id, courses):
    requirements = []
    order = None
    for course in courses:
        if course['id'] == id:
            order = course['order']                        
    for course in courses:
        if course['order'] < order:
            requirements.append(course['id'])
    return requirements

def calculate_courses_requirement():
    courses = extract_basic_courses_info()
    for course in courses:
        course.update({'requirements':calculate_one_course_requirement(course['id'], courses)})
        course.update({
            u'description':u'Học phần %s (%s) tương đương với %s tín chỉ, yêu cầu cần sinh viên đã qua các môn "%s" để đăng ký' % 
            (
                course['name'].decode('utf-8'), 
                course['id'], 
                course['cost'], 
                '-'.join(course['requirements']))
            })
    return courses

def get_min_requirements_index(courses):
    min_requirements = 9999
    for course in courses:
        if len(course['requirements']) < min_requirements:
            min_requirements = len(course['requirements'])
    for course in courses:
        if len(course['requirements']) == min_requirements:
            return courses.index(course)

def generate_courses():
    courses = calculate_courses_requirement()
    while courses:
        course = courses.pop(get_min_requirements_index(courses))
        yield course

def main():
    for course in generate_courses():
        pprint(course)
        time.sleep(0.3)

if __name__ == '__main__':
    main()
