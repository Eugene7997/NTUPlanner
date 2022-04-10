from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Mods, Exams, Session
from .serializers import modsSerializers, examSerializer, sessionSerializers
# Create your views here.


class modsView(generics.ListCreateAPIView):
    """
    View to list all courses that are offered in a particular semester. \n
    :return: List containing course code and course name for all the courses offered for a semester.
    """
    queryset = Mods.objects.all().values('courseCode', 'courseName').distinct()
    serializer_class = modsSerializers


class sessionViews(APIView):
    """
    View to retrieve all information of a particular course. Information includes the course name, course code, AU, exams records
    and all the sessions for that particular course.
    """
    def get(self, *args, course):
        """
        Get handler method to retrieve information of a course and returns all information regarding the course.\n
        :param args: NIL \n
        :param course: The course that the user is searching for. \n
        :type course: str
        :return: All information for a course with a http 200 ok response if the course is found in the database. Else, no information is returned with a http 404 not found response.
        """
        modsRecords = Mods.objects.filter(courseCode=course)

        if not modsRecords:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        examRecords = Exams.objects.filter(courseCode=course)

        results = {}
        session = []
        results['courseCode'] = modsRecords[0].courseCode
        results['courseName'] = modsRecords[0].courseName
        results['courseAU'] = modsRecords[0].courseAU
        for queries in modsRecords:
            sessions = Session.objects.filter(courseIndex=queries.courseIndex)
            for i in sessions:
                session.append(sessionSerializers(i).data)
        results["sessions"] = session
        if examRecords:
            results['exams'] = examSerializer(examRecords[0]).data
        else:
            results['exams'] = None

        return Response(results, status=status.HTTP_200_OK)

