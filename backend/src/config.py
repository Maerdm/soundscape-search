from pymongo import MongoClient
import pymongo
import os

"""
set the ip adress of the audio server (this is your ip adress of you local machine)
"""
ip_audio_server = "http://127.0.0.1:8080/"
# ip_audio_server = os.environ.get('IP_AUDIO_SERVER')

"""
The following code is for use without docker:
set the path to your audio files. This is for the donwload option in the frontend. 
connect to MongoDB (if using MongoDB Atlas, the path is different)
"""
audio_folder = '/Users/maed/Documents/Projects/SSClaVis/Dataset/Recordings/Recordings_matched'
temp_zip_path = "/Users/maed/Desktop/Sclavis/temp/playlist.zip"
client = MongoClient('mongodb://localhost:27017/')

"""
The following code is for use with docker, comment the one above
build the entire app: docker-compose build
run the app: docker-compose -p my_app up

build only backend image: docker build -t soundscape_backend .
run the backend: docker run --name soundscape_backend -d -p 8000:8000 -v /the_path_to_your_audiofiles:/app/recordings soundscape_backend

before building, change the paths to the following:
"""

# audio_folder = '/app/recordings'
# temp_zip_path = "/app/playlist.zip"
# client = MongoClient(os.environ.get('MongoClient'))

"""
set the database and collection. Needs to match with the name of your mongoDB database and collection
"""

db = client['soundscape_search']
collection = db['dataset_demo']
find_source = collection.create_index([('FGsource', pymongo.ASCENDING)])

"""
number of soundscapes beeing returned by a search query (sliders and text search)
"""
length_soundscape_list = 100
length_text_search_list = 200