import React, { Component } from 'react';
import pic1 from '../images/pic1.jpg';
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '../style/navbar.css';

/**
 * This component implements the navigation bar which is used to navigate between Map page and Main page of the application.
 */
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() { 
        return (
            <div>
                <Navbar className="custom-navbar" bg="dark" variant="dark" expand="lg" width="100%">
                    <img src={pic1} className="logoimg" alt='NTUPlanner Logo'></img>
                    <Navbar.Brand>
                        <p className="navbarContainer">NTUPlanner</p>
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <button className="btn btn-light" onClick={this.props.onChangeMainPage}>Timetable</button>
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <button className="btn btn-light" onClick={this.props.onChangeMapPage}>Map</button>
                    </Navbar.Brand>
                </Navbar>
            </div>
        );
    }
}
 
export default NavBar;