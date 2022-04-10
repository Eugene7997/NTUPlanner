import React, {Component, useEffect, useState} from 'react';
import Map from './components/Map';
import Navbar from "./components/NavBar";
import Timetable from "./components/Timetable";
import SearchBar from "./components/SearchBar";
import Parser from './components/parser'; 
import DataBaseReqMgr from "./components/DataBaseMgr";
import CourseList from "./components/CourseList";
import 'bootstrap/dist/css/bootstrap.css';
import './style/mainPage.css';

/**
 * @class
 * This is the main App component where most of the application logic is held.
*/
function App() {
    const [pageStatus, setPageStatus] = useState(false);
    const changeMapPage = () => setPageStatus(true);
    const changeMainPage = () => setPageStatus(false);
    const [curListOfSessions, setListOfSessions] = useState([]);
    const [curListOfCourses, setListOfCourses] = useState([]);
    const [quickViewToggle, setquickViewToggle] = useState(false)
    const [listOfColors, setListOfColors] = useState(["#ffcdd2", "#bbdefb", "#c8e6c9", "#ffecb3", "#e1bee7", "#b2dfdb", "#d7ccc8", "#cfd8dc"]);
    const [colorAllocation, setColorAllocation] = useState({});

    const parser = new Parser();

    /**
     * This function is responsible for adding sessions of the specified course into the frontend system.
     * @param {String} courseCode - Course code from user input.
     * @returns void
     */
    const addSessionFromSearchBar = async (courseCode) => {
        const databaseMgr = new DataBaseReqMgr();
    
        for (const course of curListOfCourses) {
            if (courseCode.normalize() === course.normalize()) {
                return null
            }
        }

        let temp = await databaseMgr.getDataForCourseMgrFromCloud(courseCode)
        setListOfSessions([...curListOfSessions, ...parser.parseDataFromDjangoForCourseMgr(temp)]);
        setListOfCourses([...curListOfCourses, courseCode])
        addColorAllocationFor(courseCode);
    }

    /**
     * This function allocates to a course a color. Sessions from the same course would be rendered in the same color. The
     * corresponding course in the course list would also be rendered with the same color.
     * @param courseCode - Course code from user input.
     */
    const addColorAllocationFor = (courseCode) => {
        const nextColorAllocation = Object.assign({}, colorAllocation);
        nextColorAllocation[courseCode.toString()] = listOfColors[0];
        setColorAllocation(nextColorAllocation);

        const nextListOfColors = [...listOfColors];
        nextListOfColors.shift();
        setListOfColors(nextListOfColors);
    }

    /**
     * This function removes the color allocation for a course when the user deletes the course through the course list.
     * @param courseCode - Course code of the course which the user is removing.
     */
    const removeColorAllocationFor = (courseCode) => {
        const nextListOfColors = [...listOfColors];
        nextListOfColors.push(colorAllocation[courseCode.toString()]);
        setListOfColors(nextListOfColors);

        const nextColorAllocation = Object.assign({}, colorAllocation);
        delete nextColorAllocation.courseCode;
        setColorAllocation(nextColorAllocation);
    }

    /**
     * This function is used to send the current sessions data to the timetable.
     * @param {Object[]} data - Current list of sessions of the courses added by the user.
     * @returns {Object[]} - Parsed data for timetable.
     */
    const sendDataToTimeTable = (data) => {
        return parser.parseDataFromCourseMgrForTimeTable(data)
    }

    /**
     * This function is used to send the current sessions data to the map.
     * @param {Object[]} data - Current list of sessions of the courses added by the user.
     * @returns {Object[]} - Parsed data for map.
     */
    const sendDataToMap = (data) => {
        return parser.parseDataFromCourseMgrForMap(data)
    }

    /**
     * This function is used to send the current sessions data to the course list.
     * @param {Object[]} data - Current list of sessions of the courses added by the user.
     * @returns {Object[]} - Parsed object data for course list.
     */
    const sendDataToCourseList = (data) => {
        return parser.parseDataFromCourseMgrForCourseList(data)
    }

    /**
     * This method is used to delete courses in response to an update from course list.
     * @param {String} courseCode - Course code that the user selected to be removed from course list.
     */
    const handleDeleteCourseFromCourseList = (courseCode) => { 
        var selectedCourseCode = courseCode
        let updatedListOfSessions = curListOfSessions.filter(element => selectedCourseCode.normalize() != element.courseCode.normalize())
        let updatedListOfCourses = curListOfCourses.filter(element => selectedCourseCode.normalize() != element.normalize())
        setListOfSessions([...updatedListOfSessions])
        setListOfCourses([...updatedListOfCourses])
        removeColorAllocationFor(courseCode);
    }

    /**
     * This method is used to update current session and course list.
     */
    const updateList = () => {
        setListOfSessions([...curListOfSessions])
        setListOfCourses([...curListOfCourses])
    }

    /**
     * This method is responsible for the opening of quick view functionality of the system.
     * @param {String} courseCode - The course code of the session on the timetable that was selected by the user.
     * @returns void
     */
    const openQuickView = (courseCode) => {
        for (var i = 0; i < curListOfSessions.length; i++) {
            if (curListOfSessions[i].courseCode.match(courseCode)) {
                curListOfSessions[i].isHidden = false
            }
            else {
                if (curListOfSessions[i].isActive === false) {
                    curListOfSessions[i].isHidden = true
                }
            }
            curListOfSessions[i].isHover = false
        }
        updateList()
        setquickViewToggle(!quickViewToggle)
    }

    /**
     * This method is responsible for the closing of quick view functionality of the system.
     * @param {String} courseCode - The course code of the session on the timetable that was selected by the user.
     * @param {String} courseIndex - The course index of the session on the timetable that was selected by the user.
     * @returns void
     */
    const closeQuickView = (courseCode, courseIndex) => {
        for (var i = 0; i < curListOfSessions.length; i++) {
            if (curListOfSessions[i].courseCode.match(courseCode)) {
                curListOfSessions[i].isHidden = true
                curListOfSessions[i].isActive = false
            }
            if (curListOfSessions[i].courseIndex.match(courseIndex)) {
                curListOfSessions[i].isHidden = false
                curListOfSessions[i].isActive = true
            }
            if (curListOfSessions[i].isActive === false) {
                curListOfSessions[i].isHidden = true
            }
            curListOfSessions[i].isHover = false
        }
        updateList()
        setquickViewToggle(!quickViewToggle)
    }

    /**
     * This method is responsible for toggling on the hovering functionality in the system.
     * @param {String} courseIndex - The course index of the session on the timetable that the user was hovering on.
     * @returns void
     */
    const handleToggleHoverOn = (courseIndex) => {
        for (var i = 0; i < curListOfSessions.length; i++) {
            if (curListOfSessions[i].courseIndex.match(courseIndex)) {
                if (curListOfSessions[i].isActive === false) {
                    curListOfSessions[i].isHover = true
                }
            }
        }
        updateList()
    }
    
    /**
     * This method is responsible for toggling off the hovering functionality in the system.
     */
    const handleToggleHoverOff = () => {
        for (var i = 0; i < curListOfSessions.length; i++) {
            curListOfSessions[i].isHover = false
        }
        updateList()
    }

    return (
        <div>
            <div>
                <Navbar onChangeMainPage={changeMainPage} onChangeMapPage={changeMapPage}/>
            </div>
            <div className="mainPageContainer">
                <div className="leftContainer">
                    {pageStatus ?
                        <Map receiveData={sendDataToMap(curListOfSessions)}/> 
                        :
                        <div>
                            <Timetable receiveData={sendDataToTimeTable(curListOfSessions)}
                                       timemap = {parser.getTimeMap()}
                                       onHandleQuickView={(coursecode,courseindex)=> { quickViewToggle ? closeQuickView(coursecode,courseindex): openQuickView(coursecode)}}
                                       onHandleToggleHoverOn={(courseindex)=>{handleToggleHoverOn(courseindex)}}
                                       onHandleToggleHoverOff={()=>{handleToggleHoverOff()}}
                                       colorAllocation={colorAllocation} />
                        </div>
                    }

                </div>
                <div className='rightContainer'>
                    <div>
                        <SearchBar placeholder="Enter Course Code..."
                                   addCourse={addSessionFromSearchBar}/>
                    </div>
                    <div>
                        <CourseList data={sendDataToCourseList(curListOfSessions)}
                                    delCourse={(courseCode) => {handleDeleteCourseFromCourseList(courseCode)}}
                                    colorAllocation={colorAllocation} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;