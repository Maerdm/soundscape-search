# Soundscape Search App

A web application for interactive exploration and acoustic feature visualization.
![editor](https://github.com/Maerdm/soundscape-search/assets/43093891/3fd31bf0-60da-4ecf-9253-940c775391ef)
![editor](https://github.com/user-attachments/assets/c9c1b18f-1b0f-4456-86e5-b35d99cace10)

### Information

The application allows to create complex search queries using combination of these items:

__Soundscape items:__ pleasant, vibrant, eventful, chaotic, annoying,	monotonous,	uneventful,	calm (ISO 12913)

__ISO:__ Eventfulness, Pleasantness (ISO 12913)

__Soundscape composition:__ Nature, Human, Household, Installation, Signals, Traffic, Speech, Music

__Acoustic features:__ LAeq, Loudness, Fluctuation Strength, Relative Approach, Sharpness, Roughness, Tonality

__Additional information:__ Activity and Location (description of the most salient sound source)

Acoustic Feature visualization:
- Loudness (ISO 532-1:2017)
- Roughness (by Daniel and Weber)
- Sharpness (DIN 45692)
- Prominence Ratio (ECMA 418-1)
- Tone-to-Noise Ratio (ECMA 418-1)

You can find inforamtion about the dataset and feature extraction in *dataset/dataset_creation.ipynb*. Due to privacy policies, we are not allowed to publish the audio files. For testing purposes, we included a tiny dataset consiting of 20 audiofiles (check the dataset folder). You can find the entire dataset (without audio files) here: https://doi.org/10.5281/zenodo.7858848

For a detailed explanation of the web application, check out the following publications:
Main branch: [A revised Web Application for Interactive Exploration and Visualization of ISO 12913 Soundscape Datasets](link)
DAGA branch:  [Advanced Soundscape Search: A Web Application for Interactive Exploration of ISO 12913 Datasets](https://www.researchgate.net/publication/380297332_Advanced_Soundscape_Search_A_Web_Application_for_Interactive_Exploration_of_ISO_12913_Datasets)

### Installation

1. install mongoDB (or any other database) on your machine and load dataset to the database
    --> for further information check: *dataset/store_to_database.ipynb*
2. use a server to host the audio files (e.g. apache)
3. install dependencies with `npm install` and `pip install requirements.txt`
4. in backend/src/config.py set the ip adress of *ip_audio_server* to the ip adress of your local machine
5. in *frontend/src/components/NavBar/utils.js*, also set the ip adress of your local machine
6. start backend: `uvicorn "src.backend_v1:app" --host "0.0.0.0" --reload`, start frontend: `npm start`

### Running with docker

1. install mongoDB on your machine and load datasets to the database
    --> for further information check: *dataset/store_to_database.ipynb*
2. in backend/src/config.py set the ip adress of ip_audio_server to the ip adress of your local machine
3. in *frontend/src/ip_config.js*, also set the ip adress of your local machine
5. in the `docker-compose.yml` file, set the volumes to the path of your audiofiles: `path_to_audio_files:/app/recordings`
4. run following command: `docker-compose build`, after that run: `docker-compose -p soundscape-search up` (localhost:3000)


