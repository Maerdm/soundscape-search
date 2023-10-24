import uvicorn
from pydantic import parse_obj_as
from typing import List
from bson.objectid import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import FastAPI, HTTPException, BackgroundTasks
import random
import json
import os
import io
import zipfile
import pandas as pd
import string
from fuzzywuzzy import fuzz
import math

from src.data_types import *
from src.nearest_neighbour import *
from src.config import *

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nn_attributes = {'pleasant': 1, 'vibrant': 1, 'eventful': 1, 'chaotic': 1, 'annoying': 1, 'monotonous': 1, 'uneventful': 1, 'calm': 1}

slider_attributes = {'pleasant': 1, 'vibrant': 1, 'eventful': 1, 'chaotic': 1, 'annoying': 1, 'monotonous': 1, 'uneventful': 1, 'calm': 1,
                    'SC_Nature':1, 'SC_Human':1, 'SC_Household':1, 'SC_Installation':1, 'SC_Signals':1, 'SC_Traffic':1, 'SC_Speech':1, 'SC_Music':1, 
                    'LAeq_default':1, 'N5_default':1, 'FavgArith_default':1, 'RAavgArith':1, 'SavgArith_default':1, 'R_default':1, 'T_default':1 }

def randomword(length):
   """used for testing webapp"""
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))

def set_database(data):
    global collection 
    collection = db[data]

def get_all_ids_and_nn_attributes():
    soundscape_ids = []
    radar_attributes = []

    for doc in collection.find({}, nn_attributes):
        soundscape_ids.append(doc["_id"])
        items = []
        for i in nn_attributes:
            items.append(doc[str(i)])
        radar_attributes.append(items)

    return [soundscape_ids, radar_attributes]

def get_soundscape_information(top_ID):
    """
    expects list of Object IDs [ObjectId('646da160550d151f16024ff1'), ObjectId('646da160550d151f16024fe8')]
    """
    soundscapes = []

    for i, val in enumerate(top_ID):
        for soundscape in collection.find({"_id":ObjectId(str(val))}):
            entries_to_remove = ['_id']
            for i in entries_to_remove:
                soundscape.pop(i, None)

            soundscape['audio_ip'] = ip_audio_server + soundscape['file_name'] + soundscape['suffix']
            soundscape['dataset'] = str(collection.name)
            soundscapes.append(soundscape)

    return parse_obj_as(List[Soundscape_List], soundscapes)

def get_soundscapes_nn(inputVector):
    all_ids_attributes = get_all_ids_and_nn_attributes()
    top_soundscape_ids = k_d_tree(all_ids_attributes, inputVector, length_soundscape_list)
    soundscapes = get_soundscape_information(top_soundscape_ids)
    return soundscapes

def get_soundscapes_slider_ranges(inputVector):

    queries = []

    for item in inputVector:
        field_name = item[1]
        values = item[0]
        query = {field_name: {"$gte": values[0], "$lte": values[1]}}
        queries.append(query)

    final_query = {"$and": queries}
    result = collection.find(final_query, slider_attributes)
    ids = [doc['_id'] for doc in result]

    # store ids in global variable --> needed for AudioPlaylistTabs
    global ids_slider_ranges
    ids_slider_ranges = ids

    num_soundscapes_tabs = math.ceil(len(ids)/100)
    soundscapes = get_soundscape_information(ids[:100])

    return soundscapes, num_soundscapes_tabs

def get_random_soundscapes():

    soundscapes = []

    pipeline = [{'$sample': {"size": length_soundscape_list}}]
    random_soundscapes = collection.aggregate(pipeline)

    for soundscape in random_soundscapes:   
        soundscape['audio_ip'] = ip_audio_server + soundscape['file_name'] + soundscape['suffix'] 

        soundscape['dataset'] = str(collection.name)
        #soundscape['source'] = randomword(random.randrange(30, 200))
        #soundscape['Activity'] = randomword(random.randrange(50, 300))
        soundscapes.append(soundscape)

    return parse_obj_as(List[Soundscape_List], soundscapes)

def search_soundscapes(text, max_results=50): 
    searchResults = []
    counter = 0 

    cursor = collection.find({})

    entries_to_remove = ['_id']
    for soundscape in cursor:
        if counter >= max_results: 
            break

        for i in entries_to_remove:
            soundscape.pop(i, None)

        if fuzz.partial_ratio(text, soundscape['FGsource']) >= 65:
            soundscape['audio_ip'] = ip_audio_server + soundscape['file_name'] + soundscape['suffix']
            soundscape['dataset'] = str(collection.name)
            soundscape['fuzz_score'] = fuzz.partial_ratio(text, soundscape['FGsource'])

            searchResults.append(soundscape)
            counter += 1 
        
            searchResults.sort(key=lambda soundscape: soundscape['fuzz_score'], reverse=True)
         
    return searchResults

def zip_audio_and_playlist(playlist):
     
    zip_buffer = io.BytesIO()
    json_data = []

    for soundscape in playlist:
        json_data.append(soundscape.dict())

    df = pd.DataFrame(json_data)
    csv_file_path = "soundscapes.csv"
    df.to_csv(csv_file_path, index=False)

    json_file_path = "soundscapes.json"
    with open(json_file_path, 'w') as json_file:
        json.dump(json_data, json_file)

    with zipfile.ZipFile(zip_buffer, 'w') as zipf:
        zipf.write(csv_file_path)  # add csv file 
        zipf.write(json_file_path)

        for soundscape in playlist: # add audio files
            file_path = os.path.join(audio_folder, soundscape.file_name + ".wav")
            with open(file_path, "rb") as audio_file:
                zipf.writestr(f'audiofiles/{soundscape.file_name}.wav', audio_file.read()) 

    # store temporary zip file
    zip_buffer.seek(0)

    with open(temp_zip_path, "wb") as temp_zip_file:
        temp_zip_file.write(zip_buffer.read())

    response = FileResponse(temp_zip_path, media_type='application/zip', filename="playlist.zip")
    os.remove(csv_file_path)
    os.remove(json_file_path)

    return response

def delete_file_after_response(file_path: str):
    def delete():
        try:
            os.remove(file_path)
        except FileNotFoundError:
            pass
        
    return delete

@app.get("/")
def home():
    return {"message": "Home"}

@app.get("/randomSoundScapes", response_model=List[Soundscape_List]) # 
def get_soundscapes():
    return get_random_soundscapes()

@app.post("/soundScapesNearestNeighbour", response_model=List[Soundscape_List])
def get_soundscapes(features: Radar_Attributes):
    inputVector = [features.pleasant, features.vibrant, features.eventful, features.chaotic, features.annoying, 
                   features.monotonous, features.uneventful, features.calm]
    soundscapes = get_soundscapes_nn(inputVector)

    return soundscapes

@app.post("/soundScapesSliderRanges", response_model=ResponseModel)
def get_soundscapes(features: Slider_Attributes):
    
    inputVector = [[getattr(features, item)[:-1], item] for item in slider_attributes if getattr(features, item)[-1] == 1]

    if len(inputVector) != 0:
        soundscapes, num_soundscapes_tabs = get_soundscapes_slider_ranges(inputVector)
        response = ResponseModel(soundscapes=soundscapes, num_soundscapes_tabs=num_soundscapes_tabs)
        return response

@app.post("/soundScapesSliderRangesFromList")
def get_soundscapes(num_tab: NumberOfTabs):

    num_tab = num_tab.num_soundscapes_tabs
    start_index = (num_tab - 1) * 100
    end_index = min((num_tab * 100), len(ids_slider_ranges))
    soundscapes = get_soundscape_information(ids_slider_ranges[start_index:end_index])

    return soundscapes

@app.post("/soundScapesIsoRanges", response_model=ResponseModel)
def get_soundscapes(features: ISO_Attributes):

    attribute_names = ['ISO_Pleasantness', 'ISO_Eventfulness']
    inputVector = [[getattr(features, item)[:-1], item] for item in attribute_names if getattr(features, item)[-1] == 1]

    if len(inputVector) != 0:
        soundscapes, num_soundscapes_tabs = get_soundscapes_slider_ranges(inputVector)
        response = ResponseModel(soundscapes=soundscapes, num_soundscapes_tabs=num_soundscapes_tabs)
        return response

@app.post("/soundScapesTextSearch", response_model=List[Soundscape_List])
def get_soundscapes(text: Search):
    soundscapes = search_soundscapes(text.searchSoundscape, length_text_search_list)
    return soundscapes

@app.post("/downloadPlaylist")
async def download_playlist(background_tasks: BackgroundTasks, playlist: List[Soundscape_List]):
    try:
        response = zip_audio_and_playlist(playlist)
        background_tasks.add_task(delete_file_after_response(temp_zip_path))
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error processing playlist")

@app.post("/savePlaylist")
def save_playlist(playlist: List[Soundscape_List]):
    return playlist

@app.post("/setDatabase")
def change_database(data: DataSet):
    set_database(data.dataset)
    return db.list_collection_names()

if __name__ == "__main__":
    uvicorn.run("backend_v1:app", host="0.0.0.0", port=8000, reload=True)
