from pymongo import MongoClient
import pymongo
import os

"""
The following code is for use without docker:
set the path to your audio files. This is for the donwload option in the frontend.
connect to MongoDB (if using MongoDB Atlas, the path is different)
"""

# ip_audio_server = "http://127.0.0.1:8080/"
# audio_folder = "../dataset/audiofiles"
# temp_zip_path = "../dataset/audiofiles/temp/playlist.zip"
# client = MongoClient('mongodb://localhost:27017/')

"""
The following code is for use with docker, comment out the one above
build the entire app: docker-compose build
run the app: docker-compose -p soundscape-search
before building, change the paths to the following:
"""

ip_audio_server = os.environ.get('IP_AUDIO_SERVER', 'http://audioserver/')
audio_folder = '/app/recordings'
temp_zip_path = "/app/playlist.zip"
# Use the MongoDB service name 'mongodb' instead of 'localhost'
mongo_uri = os.environ.get('MongoClient', 'mongodb://mongodb:27017')
print(f"Connecting to MongoDB at: {mongo_uri}")
client = MongoClient(mongo_uri)

"""
set the database and collection.
"""

db = client['soundscape_search']
collection = db['dataset']

"""
number of soundscapes beeing returned by a search query (sliders and text search)
"""
length_soundscape_list = 100
length_text_search_list = 200