import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {FaRegClock} from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { updateSoundscape, storeSoundscape, removeSoundscape } from './actions';
import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './AudioPlaylist.css';

function AudioPlaylist(){

    const dispatch = useDispatch();
    var playlistSearch = useSelector((state) => state.soundscape_Playlist);
    var playlistStored = useSelector((state) => state.storedSoundscapes);
    var playlistType = useSelector((state) => state.playlistType);
    var buttonPressed = useSelector((state) => state.buttonPressed);
    var current = useSelector((state) => state.currentSoundcape);
    var currentTab = useSelector((state) => state.numCurrentTab);

    const [playlistName, setPlaylistName] = useState('Search Results:');
    const [checkAllItems, setcheckAllItems] = useState(false);
    const [playlist, setPlaylist] = useState({});
    const [playlistIndex, setPlaylistIndex] = useState(0);
    const [clickedIndex, setClickedIndex] = useState(-1);
    const [checkboxes, setCheckboxes] = useState(Array.from({ length: 100 }, () => false));

    const bookmarkSoundscapeRef = useRef(null);
    const checkboxesRef = useRef(checkboxes);

    function handleBookmarkClick(song, event, index) { 
        if(event.target.checked){
            setTimeout(() => {
                dispatch(storeSoundscape(song));
            }, 10);
            const updatedCheckboxes = [...checkboxes];
            updatedCheckboxes[index] = true;
            checkboxesRef.current = updatedCheckboxes; 
            setCheckboxes(updatedCheckboxes);
        }
        if(!event.target.checked){
            setTimeout(() => {
                dispatch(removeSoundscape(song.file_name));
            }, 10);
            const updatedCheckboxes = [...checkboxes]; 
            updatedCheckboxes[index] = false;
            checkboxesRef.current = updatedCheckboxes;
            setCheckboxes(updatedCheckboxes);
        }
    }

    function deleteStoredPlaylist(){
        const userConfirmed = window.confirm('Do you want to delete the whole playlist?');
        if (userConfirmed) {
            playlistStored.soundscapes.forEach((soundscape) => {
                dispatch(removeSoundscape(soundscape.file_name));
            });
        } else {
            return;
        }
    }

    const handleDeleteClick = (file_name) => {
        dispatch(removeSoundscape(file_name));
    };

    const toggleAllItems = (event) => {        
        var updatedCheckboxes = [...checkboxes]; 

        const matchingIndices = [];

        if(event.target.checked){

            playlistStored.soundscapes.forEach((arrayItem, arrayIndex) => {
                let objectIndex = -1;
                for (const key in playlistSearch) {
                    if (playlistSearch.hasOwnProperty(key)) {
                        objectIndex += 1;
                        if (JSON.stringify(arrayItem) === JSON.stringify(playlistSearch[key])) {
                                                matchingIndices.push({objectIndex});
                            break;
                        }
                    }
                }
            });
            if(matchingIndices.length !== 0){
                setcheckAllItems(false);
                
                updatedCheckboxes = Array.from({ length: 100 }, () => false); // uncheck toggle buttons
                checkboxesRef.current = updatedCheckboxes; 
                setCheckboxes(updatedCheckboxes);
                
                for (const key in playlistSearch) { // remove from stored Playlist
                    if (playlistSearch.hasOwnProperty(key)) {
                        const item = playlistSearch[key];
                        dispatch(removeSoundscape(item.file_name))
                    }
                }  
            }
            else{
                setcheckAllItems(true);
                
                updatedCheckboxes = Array.from({ length: 100 }, () => true); // check toggle buttons
                checkboxesRef.current = updatedCheckboxes; 
                setCheckboxes(updatedCheckboxes);
                
                for (const key in playlistSearch) { // add to stored Playlist
                    if (playlistSearch.hasOwnProperty(key)) {
                    const item = playlistSearch[key];
                    dispatch(storeSoundscape(item))
                    }
                }
            }
        }

        if(!event.target.checked){
            setcheckAllItems(false);
            // uncheck toggle buttons
            updatedCheckboxes = Array.from({ length: 100 }, () => false);
            checkboxesRef.current = updatedCheckboxes; 
            setCheckboxes(updatedCheckboxes);

            // remove from stored Playlist
            for (const key in playlistSearch) {
                if (playlistSearch.hasOwnProperty(key)) {
                    const item = playlistSearch[key];
                    dispatch(removeSoundscape(item.file_name))
                  }
              }
        }
    }

    function number_format(val){
        var minutes = Math.floor(val/60)
        var seconds = val - minutes * 60;
        
        if(isNaN(val)){ minutes = "0"; seconds = "0";}
        if(seconds === 0 || seconds < 10){
          seconds =  "0" + seconds.toString() 
        }
        return minutes.toString() + ":" + seconds.toString()
    }

    function create_index(val) {
        val = val + 1
        if (val < 10) {val = "00" + val.toString()}
        if (val >= 10 && val < 100) {val = "0" + val.toString() }
        else{val = val.toString()}
        return val
    }

    useEffect(() => {
   
        const matchingIndices = [];

        // Check if items in playlist are also in stored playlist
        playlistStored.soundscapes.forEach((arrayItem, arrayIndex) => {
            let objectIndex = -1;
            for (const key in playlistSearch) {
                if (playlistSearch.hasOwnProperty(key)) {
                    objectIndex += 1;
                    if (JSON.stringify(arrayItem) === JSON.stringify(playlistSearch[key])) {
                                            matchingIndices.push({objectIndex});
                        break;
                    }
                }
            }
        });

        // update checked Boxes
        var updatedCheckboxes = Array.from({ length: 100 }, () => false);
        checkboxesRef.current = updatedCheckboxes;
        updatedCheckboxes = [...checkboxesRef.current];
        matchingIndices.forEach((item) => {
            const objectIndexValue = item.objectIndex;
            updatedCheckboxes[objectIndexValue] = true;
            checkboxesRef.current = updatedCheckboxes;
        });

        setCheckboxes(checkboxesRef.current);

        // set the checkAllItems state
        if(matchingIndices.length === Object.keys(playlistSearch).length){
            setcheckAllItems(true)
        }
        else{
            setcheckAllItems(false)
        }
    }, [currentTab, playlistStored, playlistType, playlistSearch]);

    useEffect(() => {
        bookmarkSoundscapeRef.current = current;
    }, [current]);

    useEffect(() => {
        setPlaylistIndex((currentTab - 1) * 100);
        setClickedIndex(-1)        
    }, [currentTab, playlistSearch, playlistType]);

    useEffect(() => {
        setPlaylistIndex(0);
    }, [buttonPressed]);

    useEffect(() => {
        if (playlistType) {
        setPlaylist(playlistSearch);
        } else {
            const transformedPlaylist = playlistStored.soundscapes.reduce((obj, item, index) => {
                obj[index] = item;
                return obj;
            }, {});
        setPlaylist(transformedPlaylist);
        }
    }, [playlistType, playlistSearch, playlistStored]);
    
    useEffect(() => {
        if (buttonPressed[0] === "radar") {
            setPlaylistName("Radar search results:")
        }
        if (buttonPressed[0] === "iso_slider") {
            setPlaylistName("ISO slider search results:")
        }
        if (buttonPressed[0] === "slider") {
            setPlaylistName("Single items search results:")
        }
        if (buttonPressed === "load") {
            setPlaylistName("Loaded playlist:")
        }
        if (buttonPressed === "text") {
            setPlaylistName("Text search:")
        }
    }, [buttonPressed]);
    
    
    if(playlistType){

        return (
            <div className="audioPlaylist">
                <div className="playlistNameContainer">
                    <p className="playlistButton">
                        <Checkbox 
                            checked={checkAllItems}
                            onChange={toggleAllItems} 
                            icon={<BookmarkBorderIcon sx={{ color: 'rgb(185, 185, 185)' }}/>}/>
                    </p>
                    {playlistName} 
                </div>

                <div className="songsContainer">
                {
                Object.entries(playlist).map(([index, song]) => (
                <div
                    className={`songs${parseInt(index) === clickedIndex ? " clicked" : ""}`}
                    key={index}
                    onClick={(event) => {
                      dispatch(updateSoundscape(song));
                      setClickedIndex(parseInt(index));
                    }}
                  >            
                        <div className="song">
                            <div className="section">
                                <div className="info">
                                    <p className="likeButton">  <Checkbox 
                                        checked={checkboxes[index]}
                                        onClick={event => handleBookmarkClick(song, event, index)} 
                                        icon={<BookmarkBorderIcon sx={{color: 'rgb(185, 185, 185)' }} />}/></p>

                                    <p className="index">{create_index(parseInt(index) + parseInt(playlistIndex))}</p>
                                    <p className="songName"><span className="truncate-text">{song?.file_name}</span></p>
                                    <p className="dataset"><span className="truncate-text">{song?.dataset}</span></p>
                                    <p className="duration">
                                        <i className="clock"><FaRegClock />{' '}</i>
                                        {number_format(song?.duration_s)}
                                    </p>
                                </div>
                            </div>
                            <div className="soundscapeInfo">
                                <p className="truncate-text">{song?.FGsource}</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        );
    }

    else{
        return (
    
            <div className="audioPlaylist">
    
                <div className="playlistNameContainer">
                <p className="savedLikeButton">  <IconButton aria-label="delete" size="medium" style={{ color: 'rgb(185, 185, 185)' }} 
                                                                onClick={deleteStoredPlaylist} ><DeleteIcon fontSize="inherit" /></IconButton></p>
                    {"Stored Items:"} 
                </div>                
                <div className="songsContainer" > 
                    {
                    Object.entries(playlist).map(([index, song]) => (
                        <div
                            className={`songs${parseInt(index) === clickedIndex ? " clicked" : ""}`}
                            key={index}
                            onClick={(event) => {
                              dispatch(updateSoundscape(song));
                              setClickedIndex(parseInt(index));
                            }}
                          >
    
                            <div className="song">
                            <div className="section">
                                <div className="info">
                                    <p className="likeButton">  <IconButton aria-label="delete" size="large" style={{ color: 'rgb(185, 185, 185)' }} 
                                                                onClick={() => handleDeleteClick(song.file_name)} ><DeleteIcon fontSize="inherit" /></IconButton></p>
                                                                
                                    <p className="savedSongName"><span className="truncate-text">{song?.file_name}</span></p>
                                    <p className="savedDataset"><span className="truncate-text">{song?.dataset}</span></p>
                                    <p className="duration">
                                        <i className="clock"><FaRegClock />{' '}</i>
                                        {number_format(song?.duration_s)}
                                    </p>
                                </div>
                            </div>

                            <div className="savedSoundscapeInfo">
                                <p className="truncate-text">{song?.FGsource}</p>
                            </div>

                        </div>
                    </div>
                                            
                    ))
                    } 
                </div>
            </div>
        )
    }
   
}

export {AudioPlaylist}