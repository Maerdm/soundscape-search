# Soundscape Search App

This web application allows to create complex search queries using combination of these items:

__Soundscape items:__ pleasant, vibrant, eventful, chaotic, annoying,	monotonous,	uneventful,	calm (ISO 12913)

__ISO:__ ISO_Eventfulness, ISO_Pleasantness (ISO 12913)

__Soundscape composition:__ SC_Nature, SC_Human, SC_Household, SC_Installation, SC_Signals, SC_Traffic, SC_Speech, SC_Music

__Acoustic features:__ LAeq_default, N5_default, FavgArith_default, RAavgArith, SavgArith_default, R_default, T_default

__Additional information:__ Activity Location, FGsource

Do to privacy policies, we are not allowed to publish the audio files. For testing purposes, we included a tiny dataset consiting of 20 audiofiles (check the dataset folder). You can find the entire dataset (without audio files) here: www.whereisthedataset.com

![editor](https://github.com/Maerdm/soundscape-search/assets/43093891/e5842217-081c-4816-97a5-973f1884d41a)

### Running with docker

1. install mongoDB on your machine and load dataset to the database
    
    --> for further information check: *dataset/store_to_database.ipynb*
2. in backend/src/config.py set the ip adress of ip_audio_server to the ip adress of your local machine
3. in *frontend/src/ip_config.js*, also set the ip adress of your local machine
5. in the `docker-compose.yml` file, set the volumes to the path of your audiofiles: `path_to_audio_files:/app/recordings`
4. run following command: `docker-compose build`, after that run: `docker-compose -p soundscape-search up`

### Running without docker
1. install mongoDB on your machine and load dataset to the database
    
    --> for further information check: *backend/dataset/store_to_database.ipynb*
2. use a server to host the audio files:

    --> e.g. using apache web server:    
    - on mac: `docker run -dit --name audio_server -p 8080:80 -v "path_to_your_files":/usr/local/apache2/htdocs/ httpd:2.4`
    
    - on windows: `docker run -dit --name audio_server -p 8080:80 -v C:/WindowsPath:/usr/local/apache2/htdocs  httpd:2.4`
3. install dependencies with `npm install` and `pip install requirements.txt`
4. in backend/src/config.py set the ip adress of *ip_audio_server* to the ip adress of your local machine
5. in *frontend/src/components/NavBar/utils.js*, also set the ip adress of your local machine
6. start backend: `uvicorn "src.backend_v1:app" --host "0.0.0.0" --reload`, start frontend: `npm start`