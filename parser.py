import os, sys
import pandas as pd
from bs4 import BeautifulSoup
import re

sys.path.append('--')
os.environ['DJANGO_SETTINGS_MODULE'] = '--'
import django
django.setup()


class Parser:
    """
    A parser class responsible for adding venue, exam, courses and sessions from information scraped from NTU website into the database. \n
    :ivar venueMap: Python dictionary in order to map a location name to a particular venue. (E.g. tr1: TR+1 is a key value pair in the dictionary) \n
    """
    def __init__(self):
        """
        Constructs a parser class to parse information from scraped data into the database. \n
        """
        self.venueMap = {}

    def venueParser(self):
        """
        Parse venue data from a csv file into the database. For each venue, a new record is created in the Venue database. \n
        :return: None
        """
        from api.models import Venue
        df = pd.read_csv('--')
        df = df[['Latitude', 'Longitute', 'Venue']]
        df = df[df['Venue'].notna()]
        for i in zip(df['Venue'], df['Latitude'], df['Longitute']):
            temp = "".join(re.findall("[a-zA-Z0-9]+", i[0]))
            self.venueMap[temp.lower()] = i[0]
            # print(f"Location {i[0]} with lat {i[1]}, long {i[2]}.")
            Venue.objects.create(courseVenue=i[0], latitude=i[1], longitude=i[2])

    def examParser(self):
        """
        Parse exams data from a html source into the database. For each exam, a new exam record will be created in the Exams database. \n
        :return: None
        """
        from api.models import Exams
        with open("Exam TimeTable.html", 'r') as f:
            soup = BeautifulSoup(f, "html.parser")
        tbody = soup.findAll("tr")
        for i in range(3, len(tbody)-1):
            item = tbody[i].findAll("td")
            examDate = item[0].get_text().strip()
            examDay = item[1].get_text().strip()
            examTime = item[2].get_text().strip()
            courseCode = item[3].get_text().strip()
            examDuration = item[5].get_text().strip()
            # print(f"Course {courseCode},{item[4].get_text().strip()} has exam on {examDate},{examTime} lasting {examDuration}.")
            Exams.objects.create(courseCode=courseCode, examDate=examDate, examDay=examDay, examTime=examTime, examDuration=examDuration)

    def modsParser(self):
        """
        Parse course and session data from a html source into the database. For each new course and session, a new mods and session record will be created in the Mods and Session database respectively. \n
        :return: None
        """
        from api.models import Mods, Session
        Mods.objects.all().delete()
        Session.objects.all().delete()
        directory = "--"
        pattern1 = r"[\/~\*#\^]"
        # skip all online courses and not add to the database.
        onlineCourses = ["ML0002", "ML0003", "GC0001", "ET0001", "CM5012", "HY0001"]
        sets = set()

        for file in os.listdir(directory):
            filename = os.fsdecode(file)
            print(filename)

            with open(directory + filename) as f:
                soup = BeautifulSoup(f, "html.parser")
                # find all html tags with "tbody"
                tbody = soup.findAll("tbody")

                # the table increments by 2, the first is the course code, course name, AU and other remarks
                # the next table is the one with all the info of the timings
                for i in range(0, len(tbody), 2):
                    p1 = tbody[i].findAll("td")
                    courseCode = p1[0].get_text()
                    courseName = re.sub(pattern1, "", p1[1].get_text())
                    courseAU = float(p1[2].get_text()[:-3].strip())

                    p2 = tbody[i + 1].findAll("td")
                    courseIndex = ""
                    if courseCode in onlineCourses:
                        continue

                    # some entries in p2 dont have index, so jump by 7 each time and update index if neccessary
                    # get all the entries by offsetting from j (probably got a better way to do this)
                    for j in range(0, len(p2), 7):
                        if p2[j].get_text() != "":
                            courseIndex = p2[j].get_text()
                            if courseIndex not in sets:
                                sets.add(courseIndex)
                                Mods.objects.create(courseIndex=courseIndex, courseCode=courseCode, courseAU=courseAU, courseName=courseName)

                        modRecord = Mods.objects.get(courseIndex=courseIndex)
                        courseType = p2[j + 1].get_text()
                        courseGroup = p2[j + 2].get_text()
                        lessonDay = p2[j + 3].get_text()
                        lessonTime = p2[j + 4].get_text()
                        courseVenue = re.sub(r'^/', "", p2[j + 5].get_text())
                        temp = "".join(re.findall("[a-zA-Z0-9]+", courseVenue)).lower()
                        courseRemarks = p2[j + 6].get_text().strip()
                        if temp in self.venueMap:
                            courseVenue = self.venueMap[temp]

                        print(f"{courseIndex}, {lessonTime}, {lessonDay}")
                        try:
                            Session.objects.create(courseIndex=modRecord, lessonTime=lessonTime, lessonDay=lessonDay, courseType=courseType, courseGroup=courseGroup,
                                               courseVenue=courseVenue, courseRemarks=courseRemarks)
                        except Exception:
                            pass

    def deleteAllTables(self):
        """
        Removes all existing records from the database. \n
        :return: None
        """
        from api.models import Venue, Exams, Mods, Session
        Venue.objects.all().delete()
        Exams.objects.all().delete()
        Mods.objects.all().delete()
        Session.objects.all().delete()


if __name__ == '__main__':
    parsers = Parser()
    parsers.deleteAllTables()
    parsers.venueParser()
    parsers.examParser()
    parsers.modsParser()
    # parser.deleteAllTables()
