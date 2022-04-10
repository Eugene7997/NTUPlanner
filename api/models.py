from django.db import models


# Create your models here.
class Mods(models.Model):
    """
    Django model which corresponds to the mods database table. Stores information for all the courses.
    """
    courseIndex = models.CharField(max_length=12, primary_key=True)
    """
    Index of a course. A course can have multiple indexes. \n
    """
    courseCode = models.CharField(max_length=12)
    """
    Course code which uniquely identifies the course from all courses offered in a semester. \n
    """
    courseAU = models.CharField(max_length=12)
    """
    Academic units granted by the course upon successfully clearing it. \n
    """
    courseName = models.CharField(max_length=255)
    """
    Name of the course offered in a particular semester. \n
    """


class Session(models.Model):
    """
    Django model which corresponds to the Session database table. Stores information for all sessions.
    """
    class Meta:
        unique_together = (("courseIndex", "lessonTime", "lessonDay", "courseVenue"), )

    courseIndex = models.ForeignKey('Mods', related_name='sessions', on_delete=models.CASCADE)
    """
    Index of the course, which is made of a combination of different sessions for a course. \n
    """
    lessonTime = models.CharField(max_length=12)
    """
    Specifies the starting time and ending time for a particular session. \n
    """
    lessonDay = models.CharField(max_length=12)
    """
    The day of the week where the session is held. \n
    """
    courseType = models.CharField(max_length=12)
    """
    The type of session which can be seminar (SEM), lecture (LEC/STUDIO), tutorial (TUT), or laboratory (LAB) sessions. \n
    """
    courseGroup = models.CharField(max_length=12)
    """
    Course group groups a set of sessions to an index. However there are also exceptions where different groups might have similar sessions. \n
    """
    courseVenue = models.CharField(max_length=20)
    """
    Venue where a particular session is held. Venues can include lecture theatre, tutorial rooms, laboratory rooms or online. \n
    """
    courseRemarks = models.CharField(max_length=255)
    """
    Contains additional remarks for the course. Typical remarks would include the weeks that there are sessions held. \n
    """


class Venue(models.Model):
    """
    Django model which corresponds to the Venue database table. Stores information of all the venues.
    """
    courseVenue = models.CharField(max_length=50, primary_key=True)
    """
    Venue where a particular session is held. The venue could be tutorial rooms, lecture theatre, laboratory rooms or online. \n
    """
    latitude = models.FloatField()
    """
    The latitude of a particular venue. \n
    """
    longitude = models.FloatField()
    """
    The longitude of a particular venue. \n
    """


class Exams(models.Model):
    """
    Django model which corresponds to the Exams database table. Stores information of all the exams for a semester.
    """
    courseCode = models.CharField(max_length=12, primary_key=True)
    """
    Course code which uniquely identifies the course from all courses offered in a semester. \n
    """
    examDate = models.CharField(max_length=50)
    """
    Date of the exam for a course in a particular semester. \n
    """
    examDay = models.CharField(max_length=12)
    """
    Day of the week when the exam is held. \n
    """
    examTime = models.CharField(max_length=12)
    """
    Time which the exam starts. \n
    """
    examDuration = models.CharField(max_length=12)
    """
    Total duration of an exam. \n
    """
