import '../style/courseList.css'
import React, { Component, useState, useEffect } from 'react';
import { Checkbox, IconButton, ListItem, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

/**
 * This is the Course component of the app. This component represents an instance of a course displayed on the course list.
 * @param props
 */
class Course extends Component{
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <ListItem className = {this.props.className} style={{"--color": this.props.colorAllocation[this.props.courseCode]}}>
                <Typography
                    variant="body6"
                >
                    {this.props.courseCode} {this.props.courseName} <br/>
                    Index: {this.props.courseIndex} <br/>
                    AU: {this.props.AU} 
                    {this.props.examDate!==null? 
                        <div>
                            Exam Date: {this.props.examDate} <br/>
                            Exam Time: {this.props.examTime} <br/>
                            Exam Duration: {this.props.examDuration}
                        </div>
                        :
                        <div>Exam: [Not Applicable]</div>
                    } 
                </Typography>
                <IconButton className='deleteButton' onClick={()=> {this.props.delCourse(this.props.courseCode)}}>
                    <DeleteForeverIcon />
                </IconButton>
            </ListItem>
        )
    }
}

export default Course;