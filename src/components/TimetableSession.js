import React from "react";
import '../style/timetable.css'

/**
 * The timetable session component represent a course session which is rendered on the timetable.
 * @constructor
 */
class TimetableSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseIndex: this.props.courseIndex,
            courseCode: this.props.courseCode,
            name:this.props.name,
            isActive:this.props.isActive,
            isHidden:this.props.isHidden,
            isHover :this.props.isHover,
            clashes: this.props.clashes
        };
    }
    
    render() {
        let elementClassName = this.props.className
        if (this.props.isActive) {
            elementClassName = elementClassName + " active"
        }
        else {
            elementClassName = elementClassName + " notActive"
            if (this.props.isHover) {
                elementClassName = elementClassName + " hover"
            }
        }
        return (
            <div 
                // className={ this.props.isActive === false ? this.props.className + " active" : (this.props.isHover===true ? this.props.className : this.props.className + " hover")}
                className={elementClassName}
                style={this.props.style}
                onClick={() => {this.props.onQuickView(this.props.courseCode, this.props.courseIndex)}}
                onMouseOver={() => {this.props.onToggleHoverOn(this.props.courseIndex)}}
                onMouseOut={() => {this.props.onToggleHoverOff()}}
                dayindex={this.state.dayIndex} 
                courseindex={this.state.courseIndex}
                coursecode={this.state.courseCode}
            >
                {this.props.courseCode} {this.props.courseIndex} {this.props.sessionGroup} <br/> {this.props.sessionType} <br/> {this.props.sessionVenue} <br/> {this.props.sessionRemarks} 
            </div>
        )
    }
}

export default TimetableSession