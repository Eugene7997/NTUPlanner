import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../style/map.css';

/**
 * This is the Map component of the application.
 * This component is responsible for listing all venue pins for sessions currently active on the timetable.
 */
class Map extends Component {
    state = {  }

    /**
     * Filters all active sessions on the timetable to be rendered on the map.
     * @function
     * @param data - The current list of sessions in app.
     * @returns {Object[]} - A list of active session on the timetable.
     */
    filterSessions = (data) => {
        let list = [];
        let dict = {};
        data.map((element)=>{
            
            if (element.isActive === true) {
                if (element.lat != null || element.long != null) {
                    if (dict.hasOwnProperty(element.sessionVenue) === false){
                        list.push(element)
                        dict[element.sessionVenue]=[element]
                    }
                    else{
                        dict[element.sessionVenue].push(element)
                    }
                    
                }
            }
        })
        return dict
    }

    /**
     * Initialises a list of venue pins to be rendered on the map.
     * @function
     * @returns {Object[]} - List of venue pins.
     */
    // TO-FIX: display 2 venues with the same vanue in one pin
    renderVenuePins = (data) => {
        let list = [];
        Object.entries(data).map(([key, value]) => {
            let element=value[0]; 
            let lat = element.lat
            let long = element.long
            
            list.push(
                <Marker position={[lat,long]}>
                <Popup>
                    {value.map((item) => 
                        {return <div>{item.courseCode} {item.sessionType} <br/> {item.lessonDay} {item.startTime}-{item.endTime}</div>}
                    )}
                    {element.sessionVenue}
                </Popup>
                </Marker>
            )
        })
        return list;
    }

    render() { 
        return (
            <div>
                <div>
                    <MapContainer center={[1.3485029645898687, 103.68314542646944]} zoom={17}>
                        <TileLayer
                            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                            attribution='&copy; <a href="https://docs.onemap.gov.sg/maps/images/oneMap64-01.png">OneMap</a> contributors'
                            url="https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png"
                        />
                        {this.renderVenuePins(this.filterSessions(this.props.receiveData))}
                    </MapContainer>
                </div>
            </div>
        );
    }
}
 
export default Map;
