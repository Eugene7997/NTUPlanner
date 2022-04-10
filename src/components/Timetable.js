import React from "react";
import TimetableSession from "./TimetableSession.js"
import 'bootstrap/dist/css/bootstrap.css';
import '../style/timetable.css';

/**
 * This is the Timetable component of the app. It displays sessions of courses that a user has added.
 * @param {props}
 */
class Timetable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /**
             * @property {Object[]} data - Current list of sessions received from App.
             */
            data: props.receiveData,
            /**
             * @param dataTesting -
             */
            dataTesting: [],
            /**
             * @param currentIndexes -
             */
            currentIndexes: [],
            /**
             * @param testOn -
             */
            testOn: false,
            /**
             * @property {string[]} timeIndexToTimeMap - time map for timetable time column retrieved from parser.
             */
            timeIndexToTimeMap: props.timemap,
            /**
             * @property {Object} colorAllocation - The color allocation data for each course.
             */
            colorAllocation: props.colorAllocation
        };
    }

    /**
     * This method renders the time column of timetable based on the time map that was retrieved from the parser class.
     * @param {String[]} data - Time map from parser class.
     * @returns {Object[]} - List of div elements that will be rendered as the time column on the left of the timetable.
     */
    renderTimeColumn(data) {
        const timeIndexToTime = data
        var list = [];
        for (var k = 0; k < timeIndexToTime.length; k++) {
            list.push(<div className="timeColumn">{timeIndexToTime[k]}</div>)
        }
        return list;
    }

    /**
     * This method is used to insert sessions data obtained from App into the TimeTable component.
     * @function
     * @param {int} day - dayIndex sessions is to be inserted to. 1 representing Monday, 2 representing Tuesday and so on.
     * @param {Object[]} data - List of sessions to be inserted into the timetable.
     * @returns {Object[]} - Sessions to be rendered for a particular day of the week.
     */
    insertDataIntoTimeTable(day, data) {
        const temp = [];
        const result = [];
        let columnsOccupied = new Map();
        let sessionsOccupied = new Map();
        for (let i = 0; i < this.props.timemap.length; i++) {
            columnsOccupied.set(i, new Set());
            sessionsOccupied.set(i, new Set());
        }

        for (let session of data) {
            if (session.lessonDay !== day) {
                continue;
            }
            if (session.isHidden === true) {
                continue;
            }

            let colNo = 1;
            outerLoop: while (true) {
                for (let rowNo = session.startTime; rowNo < session.startTime + session.duration; rowNo++) {
                    if (columnsOccupied.get(rowNo).has(colNo)) {
                        colNo++;
                        continue outerLoop;
                    }
                }
                break;
            }
            const copy = Object.assign({}, session);
            for (let rowNo = session.startTime; rowNo < session.startTime + session.duration; rowNo++) {
                columnsOccupied.get(rowNo).add(colNo);
                for (let i of sessionsOccupied.get(rowNo)) {
                    if (this.checkTimeClash(temp[i], session)) {
                        temp[i].clashes = true;
                        copy.clashes = true;
                    }
                }
                copy.colNo = colNo;
                sessionsOccupied.get(rowNo).add(temp.length);
            }
            temp.push(copy);
        }

        for (let session of temp) {
            let borderStyle = "1px solid black";
            if (session.clashes) {
                borderStyle = "3px solid red";
            }
            result.push(
                <TimetableSession
                    className="sessionItem"
                    style={{"--startTime":session.startTime, "--duration":session.duration, "--columnPosition":session.colNo,
                        "--borderStyle":borderStyle, "--color": this.props.colorAllocation[session.courseCode]}}
                    // style={style}
                    name={session.courseName}
                    courseIndex={session.courseIndex}
                    courseCode={session.courseCode}
                    sessionGroup={session.sessionGroup}
                    sessionType={session.sessionType}
                    sessionVenue={session.sessionVenue}
                    sessionRemarks={session.sessionRemarks}
                    onQuickView={(coursecode, courseindex)=> {this.props.onHandleQuickView(coursecode, courseindex)}}
                    onToggleHoverOn={(courseIndex)=> {this.props.onHandleToggleHoverOn(courseIndex)}}
                    onToggleHoverOff={()=> {this.props.onHandleToggleHoverOff()}}
                    isActive={session.isActive}
                    isHidden={session.isHidden}
                    isHover={session.isHover}
                />
            );
        }
        return result;
    }

    /**
     * This method checks if timetable sessions of different courses clashes with one another.
     * @function
     * @param {Object} sess1 - first session.
     * @param {Object} sess2 - second session.
     * @returns {boolean} - true if there is a clash, else false.
     */
    checkTimeClash = (sess1, sess2) => {
        if (sess1.courseIndex === sess2.courseIndex) {
            return false;
        }
        return sess1.isActive && sess2.isActive && this.teachingWeeksOverlap(sess1.activeTeachingWeeks, sess2.activeTeachingWeeks);
    }

    /**
     * This method checks if teaching weeks of sessions from different courses overlap with one another.
     * @function
     * @param {Boolean[]} remarks1 - parsed remarks from first session.
     * @param {Boolean[]} remarks2 - parsed remarks from second session.
     * @returns {boolean} - true if there is a teaching week that overlaps, else false.
     */
    teachingWeeksOverlap = (remarks1, remarks2) => {
        for (let i = 0; i < 13; i++) {
            if (remarks1[i] && remarks2[i]) {
                return true;
            }
        }
        return false;
    }

    render() {
        var timecolumns = this.renderTimeColumn(this.props.timemap);
        return (
            <div className="grid-container">
                <div className="headerItem">Time</div>
                <div className="headerItem">Monday</div>
                <div className="headerItem">Tuesday</div>
                <div className="headerItem">Wednesday</div>
                <div className="headerItem">Thursday</div>
                <div className="headerItem">Friday</div>
                <div className="headerItem">Saturday</div>
                <div className="sessionArea" style={{"--noRows":`repeat(${this.props.timemap.length}, 45px)`}}> {timecolumns} </div>
                <div className="sessionArea" style={{"--noRows":`repeat(${this.props.timemap.length}, 45px)`}}>
                    {this.insertDataIntoTimeTable(1,this.props.receiveData)}
                </div>
                <div className="sessionArea" style={{"--noRows":`repeat(${this.props.timemap.length}, 45px)`}}>
                    {this.insertDataIntoTimeTable(2,this.props.receiveData)}
                </div>
                <div className="sessionArea" style={{"--noRows":`repeat(${this.props.timemap.length}, 45px)`}}>
                    {this.insertDataIntoTimeTable(3,this.props.receiveData)}
                </div>
                <div className="sessionArea" style={{"--noRows":`repeat(${this.props.timemap.length}, 45px)`}}>
                    {this.insertDataIntoTimeTable(4,this.props.receiveData)}
                </div>
                <div className="sessionArea" style={{"--noRows":`repeat(${this.props.timemap.length}, 45px)`}}>
                    {this.insertDataIntoTimeTable(5,this.props.receiveData)}
                </div>
                <div className="sessionArea" style={{"--noRows":`repeat(${this.props.timemap.length}, 45px)`}}>
                    {this.insertDataIntoTimeTable(6,this.props.receiveData)}
                </div>
            </div>

        );
    }
}

export default Timetable