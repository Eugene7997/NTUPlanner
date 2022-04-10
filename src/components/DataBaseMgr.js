import axios from 'axios';

/**
 * This class implements the DataBaseReqMgr class.
 * DataBaseReqMgr is responsible for all data request to Django backend server.
 */
class DataBaseReqMgr {

    /**
     * This method makes an API call to Django backend that contains the database, and retrieves course code and course name of all courses. (school server)
     * @returns {Object[]} - A list of all the courses offered in a particular semester.
     */
    getDataForSearchBarFromSchoolServer() {
        let list = [];
        let temp;
        axios.get('http://172.21.148.164:8000/api/').then(resp => {
            temp = resp.data
            temp.map((element) => {
                const a = element.courseCode.concat(" ", element.courseName);
                list.push(a);
            })
        });
        return list;
    }

    /**
     * This method makes an API call to Django backend that contains the database, and retrieves course code and course name of all courses. (cloud server)
     * @returns {Object[]} - A list of all the courses offered in a particular semester.
     */
    getDataForSearchBarFromCloud() {
        let list = [];
        let temp;

        axios.get('http://94.74.92.106:8000/api/').then(resp => {
            temp = resp.data
            temp.map((element) => {
                const a = element.courseCode.concat(" ", element.courseName);
                list.push(a);
            })
        });
        return list;
    }

    /**
     * This method makes an API call to Django backend to retrieve information of the specified course. (school server)
     * @param {String} courseCode - The course code of the course selected by the user in the search bar.
     * @returns {Object} - An object which contains the all the course information for the selected course.
     */
    async getDataForCourseMgrFromSchoolServer(courseCode) {
        let temp;
        await axios.get('http://172.21.148.164:8000/api/' + courseCode).then(resp => {
            temp=resp.data
        }).catch(error => {
            console.log(error.response);
        });
        return temp
    }

    /**
     * This method makes an API call to Django backend to retrieve information of the specified course. (cloud server)
     * @param {String} courseCode - The course code of the course selected by the user in the search bar.
     * @returns {Object} - An object which contains the all the course information for the selected course.
     */
    async getDataForCourseMgrFromCloud(courseCode) {
        let temp;
        await axios.get('http://94.74.92.106:8000/api/'+ courseCode).then(resp => {
            temp=resp.data
        }).catch(error => {
            console.log(error.response);
        });
        return temp
    }
}

export default DataBaseReqMgr