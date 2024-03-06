# Soundscape Search App

This web application allows to create complex search queries using combination of these items:

__Soundscape items:__ pleasant, vibrant, eventful, chaotic, annoying,	monotonous,	uneventful,	calm (ISO 12913)

__ISO:__ ISO_Eventfulness, ISO_Pleasantness (ISO 12913)

__Soundscape composition:__ SC_Nature, SC_Human, SC_Household, SC_Installation, SC_Signals, SC_Traffic, SC_Speech, SC_Music

__Acoustic features:__ LAeq_default, N5_default, FavgArith_default, RAavgArith, SavgArith_default, R_default, T_default

__Additional information:__ Activity Location, FGsource (description of the most salient sound source)

You can find inforamtion about the ranges of each item and general information about the dataset in *dataset/store_to_database.ipynb*. Due to privacy policies, we are not allowed to publish the audio files. For testing purposes, we included a tiny dataset consiting of 20 audiofiles (check the dataset folder). You can find the entire dataset (without audio files) here: https://doi.org/10.5281/zenodo.7858848

![editor](https://github.com/Maerdm/soundscape-search/assets/43093891/3fd31bf0-60da-4ecf-9253-940c775391ef)

### Running with docker

1. install mongoDB on your machine and load datasets to the database
    --> for further information check: *dataset/store_to_database.ipynb*
2. in backend/src/config.py set the ip adress of ip_audio_server to the ip adress of your local machine
3. in *frontend/src/ip_config.js*, also set the ip adress of your local machine
5. in the `docker-compose.yml` file, set the volumes to the path of your audiofiles: `path_to_audio_files:/app/recordings`
4. run following command: `docker-compose build`, after that run: `docker-compose -p soundscape-search up` (localhost:3000)

### Running without docker
1. install mongoDB on your machine and load dataset to the database
    --> for further information check: *backend/dataset/store_to_database.ipynb*
2. use a server to host the audio files:
3. install dependencies with `npm install` and `pip install requirements.txt`
4. in backend/src/config.py set the ip adress of *ip_audio_server* to the ip adress of your local machine
5. in *frontend/src/components/NavBar/utils.js*, also set the ip adress of your local machine
6. start backend: `uvicorn "src.backend_v1:app" --host "0.0.0.0" --reload`, start frontend: `npm start`
