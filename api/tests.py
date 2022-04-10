from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from .models import Mods, Session, Exams, Venue
from .serializers import sessionSerializers, examSerializer
import json

# Create your tests here.
class sessionViewsTest(APITestCase):
    def setUp(self):
        self.courseCode = "CZ1000"
        self.courseIndex = "10981"
        self.courseName = "Algorithms and Data Structures II"
        self.courseAU = "3.0"
        self.lessonTime = "1230-1430"
        self.lessonDay = "MON"
        self.courseType = "LAB"
        self.courseGroup = "SC1"
        self.courseVenue = "SWLAB5"
        self.nonCourseVenue = "HWLAB10"
        self.courseRemarks = "Teaching Wk1,3,5,7,9,11,13"
        self.latitude = 103.14121
        self.longitude = 1.45101
        self.nonCourselatitude = 103.5812
        self.nonCourselongtitude = 1.3451
        self.examDate = "25 May 2030"
        self.examTime = "5pm"
        self.examDuration = "2 hr"
        self.examDay = "TUE"

        self.course = Mods.objects.create(courseCode=self.courseCode, courseIndex=self.courseIndex, courseName=self.courseName, courseAU=self.courseAU)
        self.exam = Exams.objects.create(courseCode=self.courseCode, examDate=self.examDate, examDay=self.examDay, examTime=self.examTime,
                                         examDuration=self.examDuration)
        self.nonCourseVenue = Venue.objects.create(courseVenue=self.nonCourseVenue, latitude=self.nonCourselatitude,
                                                   longitude=self.nonCourselongtitude)
        self.venue = Venue.objects.create(courseVenue=self.courseVenue, latitude=self.latitude,
                                                   longitude=self.longitude)
        self.sessions = Session.objects.create(courseIndex=self.course, lessonTime=self.lessonTime, lessonDay=self.lessonDay,
                                               courseType=self.courseType, courseGroup=self.courseGroup, courseVenue=self.courseVenue,
                                               courseRemarks=self.courseRemarks)

    def test_get_valid_course(self):
        self.validCourse = "CZ1000"
        response = self.client.get('/api/' + self.validCourse)
        self.assertEqual(200, response.status_code)

        results = {'courseName': self.courseName, 'courseCode': self.courseCode, 'courseAU': self.courseAU}
        self.examRecords = Exams.objects.filter(courseCode=self.validCourse)
        self.modsRecords = Mods.objects.filter(courseCode=self.validCourse)
        results['exams'] = examSerializer(self.examRecords[0]).data
        sessions = []
        for i in self.modsRecords:
            sessionsRecords = Session.objects.filter(courseIndex=i.courseIndex)
            for j in sessionsRecords:
                sessions.append(sessionSerializers(j).data)
        results['sessions'] = sessions

        response_data = response.data
        self.assertEqual(results, response_data)

    def test_get_invalid_course(self):
        self.validCourse = "CZ2000"
        response = self.client.get('/api/' + self.validCourse)
        self.assertEqual(404, response.status_code)

        response_data = response.data
        self.assertEqual({}, response_data)


