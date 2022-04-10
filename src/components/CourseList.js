
import { List } from "@material-ui/core";
import '../style/courseList.css'   
import React, { Component, useState, useEffect } from 'react';
import Course from "./CourseListItem";
import { getValue } from '@testing-library/user-event/dist/utils';

/**
 * This is the Course list component of the app. This component is responsible for listing all the courses that was added by the user into the timetable.
 * @param props
 */
class CourseList extends Component{
    constructor(props) {
        super(props);
    }

    /**
     * Filters all active sessions on the timetable to be rendered on the course list.
     * @function
     * @param {Object[]} data - The current list of sessions in timetable.
     * @returns {Object[]} - A unique list of active courses on the timetable.
     */
    filterCourses = (data) => {
        var uniqueList=[]
        var coursesAdded = [];
        data.map(session => {
            let flag = false;
            for (var i=0; i<coursesAdded.length; i++) {
                if (session.courseCode.normalize() === coursesAdded[i].normalize()) {
                    flag = true;
                }
            }
            if (flag === false) {
                if (session.isActive === true) {
                    uniqueList.push(session)
                    coursesAdded.push(session.courseCode)
                }
            }
        })
        return uniqueList
    }

    /**
     * Helper function to check if exam dates of different courses is the same.
     * @function
     * @param {string} text1 - Exam date for a course.
     * @param {string} text2 - Exam date for a course.
     * @returns {boolean} - true if the exam dates are the same, else false if different or either text is null.
     */
    checkExamDateClash = (text1,text2) => {
        if (text1 === null) {
            return false
        }
        if (text2 === null) {
            return false
        }
        if (text1.normalize() === text2.normalize()) {
            return true
        }
        else {
            return false
        }
    }

    /**
     * Helper function to check if exam time of different courses is the same.
     * @function
     * @param {number} timingIndex1 - Index where the start time of the exam appears in examTimeIndex.
     * @param {number} durationIndex1 - Duration of the exam, converted to the number of indexes it will occupy.
     * @param {number} timingIndex2 - Index where the start time of the exam appears in examTimeIndex.
     * @param {number} durationIndex2 - Duration of the exam, converted to the number of indexes it will occupy.
     * @returns {boolean} - true if the start time of exam + duration will lead to an overlap with another exam time, false otherwise.
     */
    checkExamTimeClash = (timingIndex1,durationIndex1,timingIndex2,durationIndex2) => {
        if (timingIndex1 === -1) {
            return false
        }
        if (timingIndex2 === -1) {
            return false
        }
        if (timingIndex1 === timingIndex2) {
            return true
        }
        if (timingIndex1<timingIndex2) {
            if (timingIndex1+durationIndex1 >= timingIndex2) {
                return true
            }
        }
        if (timingIndex2 < timingIndex1) {
            if (timingIndex2+durationIndex2 >= timingIndex1) {
                return true
            }
        }
        return false
    }

    /**
     * Helper function to convert the exam time into an index.
     * @function
     * @param {string} timing - Start time of the exam.
     * @returns {number} - Index which corresponds to the index where the start time appears in examTimeIndex, -1 otherwise.
     */
    translateExamTimeToIndex = (timing) => {
        if (timing === null) {
            return -1
        }
        let examTimeIndex = ['9.00 am', '9.30 am', '10.00 am', '10.30 am', '11.00 am', '11.30 am', '12.00 pm', '12.30 pm', '1.00 pm', '1.30 pm', '2.00 pm', '2.30 pm', '3.00 pm', '3.30 pm', '4.00 pm', '4.30 pm','5.00 pm', '5.30 pm', '6.00 pm', '6.30 pm', '7.00 pm', '7.30 pm', '8.00 pm', '8.30 pm']
        for (let i = 0; i < examTimeIndex.length; i++) {
            if (timing.normalize() === examTimeIndex[i].normalize()) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Helper function to convert exam duration to the number of indexes it will occupy in examTimeIndex.
     * @function
     * @param {string} duration - Duration of the exam.
     * @returns {number} - The number of indexes an exam will need.
     */
    translateExamdurationToIndex = (duration) => {
        if (duration === '1 hr') {
            return 2;
        }
        if (duration === '2 hr') {
            return 4;
        }
        if (duration === '2 hr 30 min') {
            return 5;
        }
        if (duration === '3 hr') {
            return 6;
        }
        return -1;
    }

    /**
     * Checks if any of the active courses have an exam clash.
     * @function
     * @param {Object[]} parsedData - Filtered active courses on the timetable.
     */
    markExamClash = (parsedData) => {
        let list = parsedData
        for (let i=0; i<list.length; i++) {
            for (let j=i+1; j<list.length; j++) {
                if (this.checkExamDateClash(list[i].examDate, list[j].examDate)) {
                    if (this.checkExamTimeClash(this.translateExamTimeToIndex(list[i].examTime), this.translateExamdurationToIndex(list[i].examDuration), this.translateExamTimeToIndex(list[j].examTime), this.translateExamdurationToIndex(list[j].examDuration) )) {
                        list[i].isExamClash = true;
                        list[j].isExamClash = true;
                    }
                }
            }
        }
    }   

    /**
     * Initialises a list of course components to be rendered on the course list.
     * @function
     * @param {Object[]} data - Current list of sessions on the timetable.
     * @returns {Object[]} - List of course components.
     */
    renderCoursesOnCourseList = (data) => {
        let list = this.filterCourses(data)
        this.markExamClash(list)
        let courses = list.map((value) =>{
            if (value.isExamClash === true) {
                return <Course key={value.id}
                               className={"courseListItem"+" clash"}
                               courseCode={value.courseCode}
                               courseName={value.courseName}
                               courseIndex={value.courseIndex}
                               AU={value.AU}
                               examDate={value.examDate}
                               examTime={value.examTime}
                               examDuration={value.examDuration}
                               delCourse={(courseCode) => {this.props.delCourse(courseCode)}}
                               colorAllocation={this.props.colorAllocation}/>
            }
            else {
                return <Course key={value.id}
                               className="courseListItem"
                               courseCode={value.courseCode}
                               courseName={value.courseName}
                               courseIndex={value.courseIndex}
                               AU={value.AU}
                               examDate={value.examDate}
                               examTime={value.examTime}
                               examDuration={value.examDuration}
                               delCourse={(courseCode) => {this.props.delCourse(courseCode)}}
                               colorAllocation={this.props.colorAllocation}/>
            }
        })
        return courses
    }
    
    render() {
        return (
            <div>
                <div className='courseWholeList'>
                    <h3>Course List</h3>
                    {this.props.data.length !== 0 ? this.renderCoursesOnCourseList(this.props.data):<div>Nothing here!</div>}
                </div>
            </div>
        )   
    }
}


export default CourseList;