/**
 * This is the parser class. It is responsible for the parsing of data for different components in the application.
 */
class Parser {

    #timetableMap = [
        "0830",
        "0900",
        "0930",
        "1000",
        "1030",
        "1100",
        "1130",
        "1200",
        "1230",
        "1300",
        "1330",
        "1400",
        "1430",
        "1500",
        "1530",
        "1600",
        "1630",
        "1700",
        "1730",
        "1800",
        "1830",
        "1900",
        "1930",
        "2000",
        "2030",
        "2100",
        "2130",
        "2200",
        "2230",
        "2300",
        "2330"
    ];

    // start time is always 00 or 30
    #startTimeSlots = [
        "0830",
        "0900",
        "0930",
        "1000",
        "1030",
        "1100",
        "1130",
        "1200",
        "1230",
        "1300",
        "1330",
        "1400",
        "1430",
        "1500",
        "1530",
        "1600",
        "1630",
        "1700",
        "1730",
        "1800",
        "1830",
        "1900",
        "1930",
        "2000",
        "2030",
        "2100",
        "2130",
        "2200",
        "2230",
        "2300",
        "2330"
    ]

    // end time is always in 50 or 20
    #endTimeSlots = [
        "0820",
        "0850",
        "0920",
        "0950",
        "1020",
        "1050",
        "1120",
        "1150",
        "1220",
        "1250",
        "1320",
        "1350",
        "1420",
        "1450",
        "1520",
        "1550",
        "1620",
        "1650",
        "1720",
        "1750",
        "1820",
        "1850",
        "1920",
        "1950",
        "2020",
        "2050",
        "2120",
        "2150",
        "2220",
        "2250",
        "2320"
    ]

    /**
     * This method call returns the time map for timetable time column.
     * @returns {string[]} - The time map for timetable time column.
     */
    getTimeMap() {
        return this.#timetableMap;
    }

    /**
     * This method parses data obtained from the backend api and returns a list of sessions.
     * @param {Object[]} data - Object data retrieved from backend api.
     * @returns {Object[]} - Parsed object data for App.
     */
    parseDataFromDjangoForCourseMgr(data) {
        const list = data;
        var parsedList = [];
        let listOfLectureSessions = [];
        jimmy: for (var i=0; i<data.sessions.length; i++) {
            let tempExamDate
            let tempExamTime
            let tempExamDuration

            // temp measure until exam data is inside
            if (data.exams === null) {
                tempExamDate = null
                tempExamTime = null
                tempExamDuration = null
            }
            else {
                tempExamDate = data.exams.examDate
                tempExamTime = data.exams.examTime
                tempExamDuration = data.exams.examDuration
            }

            var obj = {
                "courseCode": data.courseCode,
                "courseName" : data.courseName,
                "courseIndex" : data.sessions[i].courseIndex,
                "startTime" : this.parseStartLessonTime(data.sessions[i].lessonTime),
                "endTime" : this.parseEndLessonTime(data.sessions[i].lessonTime),
                "duration" : data.sessions[i].duration,
                "lessonDay" : data.sessions[i].lessonDay,
                "sessionType" : data.sessions[i].courseType,
                "sessionGroup" : data.sessions[i].courseGroup,
                "sessionVenue" : data.sessions[i].courseVenue,
                "lat": data.sessions[i].lat,
                "long": data.sessions[i].long,
                "sessionRemarks" : data.sessions[i].courseRemarks,
                "examDate": tempExamDate,
                "examTime": tempExamTime,
                "examDuration": tempExamDuration,
                "AU": data.courseAU,
                "isHover":false,
                "isActive":false,
                "isHidden":true
            };
            parsedList.push(obj);
        }

        let firstIndex = parsedList[0].courseIndex.normalize()
        for (var k=0; k<parsedList.length; k++) {
            let text = parsedList[k].courseIndex.normalize()
            if (text === firstIndex) {
                parsedList[k].isActive = true
                parsedList[k].isHidden = false
            }
        }
        return parsedList;
    }

    /**
     * This method parses the data obtained from App and returns a list of objects for data insertion into Timetable.
     * @param {Object[]} data - Object data from App (CourseMgr).
     * @returns {Object[]} - Parsed object data for timetable.
     */
    parseDataFromCourseMgrForTimeTable(data) {
        const list = data;
        var parsedList = [];
        for (var i=0; i<list.length; i++) {
            var obj = {
                "courseCode": list[i].courseCode,
                "courseName" : list[i].courseName,
                "courseIndex" : list[i].courseIndex,
                "startTime" : this.parseStartLessonTimeIndex(list[i].startTime),
                "endTime" : this.parseEndLessonTimeIndex(list[i].endTime),
                "duration" : this.parseDuration(this.parseStartLessonTimeIndex(list[i].startTime),this.parseEndLessonTimeIndex(list[i].endTime)),
                "lessonDay" : this.parseLessonDay(list[i].lessonDay),
                "sessionType" : list[i].sessionType,
                "sessionGroup" : list[i].sessionGroup,
                "sessionVenue" : list[i].sessionVenue,
                "sessionRemarks" : list[i].sessionRemarks,
                "activeTeachingWeeks": this.parseRemarks(list[i].sessionRemarks),
                "isHover":list[i].isHover,
                "isActive":list[i].isActive,
                "isHidden":list[i].isHidden
            };
            parsedList.push(obj);
        }
        return parsedList;
    }

    /**
     * This method parses the data obtained from App and returns a list of objects for data insertion into Map.
     * @param {Object[]} data - Object data from App (CourseMgr).
     * @returns {Object[]} - Parsed object data for map.
     */
    parseDataFromCourseMgrForMap(data) {
        const list = data;
        var parsedList = [];

        for (var i=0; i<list.length; i++) {
            var obj = {
                "courseCode": list[i].courseCode,
                "courseName" : list[i].courseName,
                "courseIndex" : list[i].courseIndex,
                "startTime" : list[i].startTime,
                "endTime" : list[i].endTime,
                "lessonDay" : list[i].lessonDay,
                "sessionType" : list[i].sessionType,
                "sessionGroup" : list[i].sessionGroup,
                "sessionVenue" : list[i].sessionVenue,
                "lat": list[i].lat,
                "long": list[i].long,
                "isActive":list[i].isActive,
                "isHidden":list[i].isHidden
            };
            parsedList.push(obj);
        }
        return parsedList;

    }

    /**
     * This method parses list of sessions stored in courseMgr for usage by CourseList.
     * @param {Object[]} data - Object data from App (CourseMgr).
     * @returns {Object[]} - Parsed object data for course list.
     */
    parseDataFromCourseMgrForCourseList(data) {
        const list = data;
        var parsedList = [];

        for (var i=0; i<list.length; i++) {
            var obj = {
                "courseCode": list[i].courseCode,
                "courseName" : list[i].courseName,
                "courseIndex" : list[i].courseIndex,
                "examDate": list[i].examDate,
                "examTime": list[i].examTime,
                "examDuration": list[i].examDuration,
                "AU": list[i].AU,
                "isActive":list[i].isActive,
                "isExamClash":false,
            };
            parsedList.push(obj);
        }
        return parsedList;
    }

    /**
     * This method takes in the lesson time of a session and returns the start time of the session.
     * @param {String} text - Lesson time of the session.
     * @returns {String} - Start time of the session.
     */
    parseStartLessonTime(text) {
        return text.substring(0,4)
    }

    /**
     * This method takes in the lesson time of a session and returns the end time of the session.
     * @param {String} text - Lesson time of session.
     * @returns {String} - End time of the session.
     */
    parseEndLessonTime(text) {
        return text.substring(5,9)
    }

    /**
     * This method takes in the start time of a session and returns the corresponding index that matches in startTimeSlots.
     * @param {int} text - Start time of session.
     * @returns {int} - Index that matches in startTimeSlots.
     */
    parseStartLessonTimeIndex(text) {
        for (var i = 0; i <this.#startTimeSlots.length; i++) {
            if (this.#startTimeSlots[i].match(text)) {
                return i+1;
            }
        }
    }
    /**
     * This method takes in the end time of a session and returns the corresponding index that matches in startTimeSlots.
     * @param {int} text - End time of session.
     * @returns {int} - Index that matches in startTimeSlots.
     */
    parseEndLessonTimeIndex(text) {
        for (var i = 0; i <this.#endTimeSlots.length; i++) {
            if (this.#endTimeSlots[i].match(text)) {
                return i+1;
            }
        }
    }

    /**
     * This method takes in the start time and end time of a session and returns the duration for a session. Duration is represented as the
     * difference in the indexes between the endTime that matches in startTimeSlots and the startTime that matches in startTimeSlots.
     * This allows us to determine the number of time slots that a particular session will occupy.
     * @param {int} startTimeIndex - Start time of session.
     * @param {int} endTimeIndex - End time of session.
     * @returns {int} - Index difference between startTime and endTime.
     */
    parseDuration (startTimeIndex, endTimeIndex) {
        return (endTimeIndex - startTimeIndex);
    }

    /**
     * This method parses the day a session into an index based on the day of the week.
     * MON is represented by index 0, TUE is represented by index 1 and so on.
     * @param {String} text - Day of the session that is taking place.
     * @returns {int} - Index which represent the day of the week a session is on.
     */
    parseLessonDay(text) {
        const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
        for (var i = 0; i <daysOfWeek.length; i++) {
            if (daysOfWeek[i].match(text)) {
                return i+1;
            }
        }

    }

    /**
     * This method filters data from the remarks of sessions into a boolean array. This will be used to determine if sessions
     * from different courses will clash.
     * @param {String} text - Remarks of a session.
     * @returns {Boolean[]} - A boolean array of size 13, which denotes whether a session occurs on a given teaching week. A true value indicates that
     * a session is held in a teaching week, and false indicates that no sessions will be held in the teaching week.
     */
    parseRemarks(text) {
        let result = new Array(13).fill(false);

        if (text === "" || text === null) {
            return new Array(13).fill(true);
        }

        text = text.trim(); // remove leading and trailing whitespaces
        text = text.replace("Teaching Wk", "") // discard prefix
        let splitText = text.split(",")

        for (let word of splitText) {
            if (isNaN(word)) { // if word is in the format x-y, where x and y are numeric values
                let splitWord = word.split("-")
                let start = parseInt(splitWord[0]);
                let end = parseInt(splitWord[1]);
                for (let i = start; i <= end; i++) {
                    result[i - 1] = true;
                }
            } else { // if word is a single numeric value
                result[parseInt(word) - 1] = true;
            }
        }
        return result;
    }
}

export default Parser;