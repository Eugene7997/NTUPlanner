from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from webdriver_manager.chrome import ChromeDriverManager

# Setup driver management software and open a browser session
service = Service(executable_path=ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Navigate to the NTU Class Schedule site
driver.get("https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main")

# Dropdown box as an element
course_year_select_element = driver.find_element(By.NAME, "r_course_yr")
# Dropdown box as a Select object
course_year_select_object = Select(course_year_select_element)

# Collection of all elements in the dropdown box with an "option" tag
all_course_year = course_year_select_element.find_elements(By.TAG_NAME, "option")

# "Load Class Schedule" button
load_class_schedule_button = driver.find_element(By.TAG_NAME, "input")

# Store the ID of the original window
original_window = driver.current_window_handle

# For each element in the dropdown box
for course_year in all_course_year:
    # Saving its rendered text as a variable e.g. "Computer Science Year 2"
    course_year_text = course_year.text

    # Saving its value attribute as a variable e.g. "CSC;;2;F"
    course_year_value = course_year.get_attribute("value")

    # If the element is not a valid choice, skip
    if course_year_value == "":
        continue

    # Select the element
    course_year_select_object.select_by_value(course_year_value)

    # Click on "Load Class Schedule" button
    load_class_schedule_button.click()

    # For each open tab in the browser
    for window_handle in driver.window_handles:
        # If the current tab is not the new tab, skip
        if window_handle == original_window:
            continue
        # Otherwise, switch to the new tab
        driver.switch_to.window(window_handle)

        # Extract HTML source and save it as a file
        html_source = driver.page_source
        open(course_year_text + ".html", "w").write(html_source)

        # Close this new tab
        driver.close()
        break

    # Switch back to the original site
    driver.switch_to.window(original_window)

# End browser session
driver.quit()
