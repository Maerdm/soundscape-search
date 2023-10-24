import React, { useState, useEffect, useRef } from 'react';
import './AudioPlaylistTabs.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { updateSoundscapePlaylist, resetReducer, updateCurrentTab } from '../NavBar/actions';

import { baseurl } from '../../ip_config.js';

const api_sliderRangesList = axios.create({ baseURL: `${baseurl}soundScapesSliderRangesFromList` });

function AudioPlaylistTabs() {

    const dispatch = useDispatch();

    var numTabs = useSelector((state) => state.numSoundscapeTabs);
    var allSoundscapes = useSelector((state) => state.soundscape_Playlist);
    var buttonPressed = useSelector((state) => state.buttonPressed);
    var playlistType = useSelector((state) => state.playlistType);
    var playlistStored = useSelector((state) => state.storedSoundscapes);

    const [page, setPage] = useState(1);
    const [buttonData, setButtonData] = useState([]);
    const [soundscapes, updateSoundscapes] = useState(0);
    const [infoText, setInfoText] = useState('Soundscapes 100-200'); // Initial text
    const [numSoundscapes, setNumSoundscapes] = useState(Object.keys(allSoundscapes).length)
    const [renderToggleButton, setRenderToggleButton] = useState(true);
    const numSoundscapesRef = useRef(numSoundscapes);
    
    const handleChange = (event, pressedPage) => {
        setPage(pressedPage);
        
        dispatch(updateCurrentTab(pressedPage))
        api_sliderRangesList.post('', { num_soundscapes_tabs: pressedPage })
        .then((response) => {
            updateSoundscapes(response.data);
            
        })
        .catch((error) => {
            const response = error.response;
            console.log(response);
        });
    };

    useEffect(() => {
        setNumSoundscapes(Object.keys(allSoundscapes).length);
    }, [allSoundscapes]);

    useEffect(() => {
        var start; var end; var range;
        numSoundscapesRef.current = numSoundscapes;
        
        if (numSoundscapes < 100) {
            start = page * 100 - 99;
            if(page ===1){
                end = numSoundscapes;   
            }
            else{
                end = numSoundscapes + (page-1) * 100
            } 
            range = `Soundscapes ${start} - ${end}`;
            setInfoText(range);
            setRenderToggleButton(true);
        }
        else {
            start = page * 100 - 99;
            end = page * 100;
            range = `Soundscapes ${start} - ${end}`;
            setInfoText(range);
            setRenderToggleButton(true);
        }

        if(playlistType === false){
          setInfoText('Saved Soundscapes: ' + Object.keys(playlistStored.soundscapes).length);
          setRenderToggleButton(false);
        }
    }, [page, numSoundscapes, playlistType, playlistStored]);

    useEffect(() => {
        setInfoText('Soundscapes')
        setPage(1);
        dispatch(updateCurrentTab(1))
    }, [buttonPressed, dispatch]);
    
    useEffect(() => {
        dispatch(resetReducer());
        dispatch(updateSoundscapePlaylist(soundscapes));
    }, [dispatch, soundscapes]);

    useEffect(() => {
        const generatedButtonData = [];
        for (let i = 1; i <= numTabs; i++) {
        generatedButtonData.push({
            value: i,
            label: i,
        });
        }
        setButtonData(generatedButtonData);
    }, [numTabs]);

  return (
    <div className="audioPlaylistTabsContainer">
      <div className="infoText">
        <p>{infoText}</p>
      </div>
      <div className="audioPlaylistTabs">
        <div className="buttonContainer">
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            {buttonData.map((button, index) => (
              renderToggleButton ? (
              <ToggleButton key={index} value={button.value}>
                {button.label}
              </ToggleButton>
              ) : null
            ))}
          </ToggleButtonGroup>
        </div>
      </div>
    </div>
  );
}

export { AudioPlaylistTabs };
