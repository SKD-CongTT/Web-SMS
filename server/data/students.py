from Crypto.Random import random
import names

DEFAULT_MAJOR = 'Computer Science'
DEFAULT_BIO = 'Love computer, playing games. Hardworking. Smart learner.'

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

def main():
    for i in range(100):
        print generate_student('2014%04d' % i)


if __name__ == '__main__':
    main()
    