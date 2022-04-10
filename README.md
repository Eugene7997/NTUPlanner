# CZ2006-LyonIsTheBest
LyonIsTheBest

# Setting up the django backend
Ensure that python3 and pip3 is available on the machine. Also, if running the backend and frontend
on a local machine only, in the frontend code ../src/components/DataBaseMgr.js change two lines. <br>

The first in at getDataForSearchBarFromCloud() change the url from 94.74.92.106:8000/api/ to 127.0.0.1:8000/api/ or the ip:port
that django will be running on.<br> 
The second is at 
getDataForCourseMgrFromCloud(courseCode) also change the url from 94.74.92.106:8000/api/ to 127.0.0.1:8000/api/ or the ip:port
that django will be running on.
#### Automated installing and configuring django <br>
Only tested on linux machine with bash. If script.sh is not runnable, do

    chmod +x script.sh
    ./script.sh

The script automates the below process and also starts the backend.

#### Manual installing and configuring django
The first thing to do is to install required libraries. Ensure that python3 and pip are also
available on the machine. <br>
Ensure that you are in the same directory as requirements.txt then run <br>

    pip3 install -r requirements.txt

In the folder with requirements.txt and script.sh there should also be 3
other folders, apifiles/, NTUPlannerfiles/ and scriptfiles/. They contains code and
data which have to be copied over later.
Next, we will have to set up the django project. 
Run the following command next. <br>

    django-admin startproject NTUPlanner
    cd NTUPlanner

Next, ensure that you are in ../NTUPlanner directory. <br>
Then run <br>

    django-admin startapp api
    cd api/
    
Now, we can copy the stuff over into the newly created directories. Ensure that you are in ../backend/NTUPlanner/api/
Copy and replace only .py files from **apifiles/** into the current directory. Then run <br>
    
    
    cd ../NTUPlanner/

Check that you are in the ../backend/NTUPlanner/NTUPlanner/ directory, then copy the files 
from **NTUPlannerfiles/** into the current folder. Now run

    cd ../
    python3 manage.py makemigrations
    python3 manage.py migrate

Then copy the files over from **scriptfiles/** directory into the current directory which is ../backend/NTUPlanner

#### Populating the data
Run the following command. It might take a while to populate the entire database.

    python3 parser.py
