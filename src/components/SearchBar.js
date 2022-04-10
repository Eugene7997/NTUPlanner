import React, {useState} from 'react';
import "../style/searchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import DataBaseReqMgr from "./DataBaseMgr";

/**
 * @class
 * This class implements SearchBar component.
 * The SearchBar handles all user input into the search bar in the web application UI.
 * User will type their desired course into the searchBar and is able to click on the items that appears in the dropdown list to select the course
 * that will be added into the system.
 */
function SearchBar({ placeholder, addCourse }) {
    const databaseMgr = new DataBaseReqMgr()
    const [data, setData] = useState(databaseMgr.getDataForSearchBarFromCloud());
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    /**
     * This method filters contents of searchbar dropdown list in response to user input.
     * @param {*} event
     * @returns void
     */
    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = data.filter(value => {
            return value.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

    /**
     * This method is used to clear the dropdown list.
     * @returns void
     */
    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");
    };

    /**
     * This method is used to parse the courseCode based on user mouse click and use it to trigger addCourse
     * method from App.
     * @param {*} event
     * @returns void
     */
    const onAddCourse = (event) => {
        const courseCode = event.currentTarget.innerText.split(" ")[0];
        clearInput();
        addCourse(courseCode);
    }

    return (
        <div className="search">
            <div className="searchInputs">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={wordEntered}
                    onChange={handleFilter}
                />
                <div className="searchIcon">
                    {filteredData.length === 0 ? (
                        <SearchIcon />
                    ) : (
                        <CloseIcon id="clearBtn" onClick={clearInput} />
                    )}
                </div>
            </div>
            {filteredData.length !== 0 && (
                <div className="dataResult">
                    {filteredData.slice(0, 15).map((value, key) => {
                        return (
                            <a className="dataItem" onClick={onAddCourse}>
                                <p>{value} </p>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SearchBar;

