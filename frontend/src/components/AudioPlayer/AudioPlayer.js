import React from 'react'
import './AudioPlayer.css';
import { useSelector, useDispatch } from 'react-redux';
import Player from 'react-h5-audio-player';
import { updateSoundscape } from '../AudioPlaylist/actions';

function AudioPlayer() {
  var current = useSelector((state) => state.currentSoundcape);
  const isGraphVisualizationView = useSelector((state) => state.isGraphVisualizationView);
  var playlist = useSelector((state) => state.soundscape_Playlist);
  
  const dispatch = useDispatch();
  
  const containerStyle = {
    height: 'calc(100% - 86vh)',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    bottom: 0,
    boxSizing: 'border-box',
    background: 'white',
    border: '1px solid #ccc',
    ...(isGraphVisualizationView ? {
      width: '100%',
      marginLeft: 0,
      marginTop: '83vh',
      left: 0,
      right: 0,
      zIndex: 10
    } : {
      width: '50vh',
      marginLeft: '74vh',
      marginTop: '83vh'
    })
  };
  
  const titleStyle = {
    color: 'black',
    padding: '6px',
    textAlign: 'center',
    fontSize: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  
  const handleClickNext = () => {
    if (!playlist || typeof playlist !== 'object') {
      console.log("Playlist is not available:", playlist);
      return;
    }
    
    const playlistArray = Object.values(playlist);
    const currentIndex = playlistArray.findIndex(item =>
      item && item.file_name === current.file_name);
    
    const isLastItem = currentIndex === playlistArray.length - 1;
    
    if (isLastItem) {
      alert("This is the last track in the playlist, tab a new playlist in the playlist section");
    } else if (currentIndex !== -1) {
      dispatch(updateSoundscape(playlistArray[currentIndex + 1]));
    }
  };
  
  const handleClickPrevious = () => {
    if (!playlist || typeof playlist !== 'object') {
      console.log("Playlist is not available:", playlist);
      return;
    }
    
    const playlistArray = Object.values(playlist);
    const currentIndex = playlistArray.findIndex(item =>
      item && item.file_name === current.file_name);
    
    const isFirstItem = currentIndex === 0;
    
    if (isFirstItem) {
      alert("This is the first track in the playlist, tab a new playlist in the playlist section");
    } else if (currentIndex > 0) {
      dispatch(updateSoundscape(playlistArray[currentIndex - 1]));
    }
  };
  
  return (
    <div className="audioPlayerContainer" style={containerStyle}>
      {isGraphVisualizationView && current.file_name && (
        <div className="audioTitle" style={titleStyle}>
          {current.file_name + " - " + current.FGsource || "Now Playing"}
        </div>
      )}
      <div className="audioPlayer">
        <Player
          autoPlay
          src={current.audio_ip}
          showSkipControls={isGraphVisualizationView} // Only show skip controls in graph view
          onClickNext={handleClickNext}
          onClickPrevious={handleClickPrevious}
        />
      </div>
    </div>
  )
}

export { AudioPlayer }