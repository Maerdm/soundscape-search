import React, { useState } from 'react'
import './AudioPlayer.css';
import { useSelector, useDispatch } from 'react-redux';
import Player from 'react-h5-audio-player';
import { updateSoundscape } from '../AudioPlaylist/actions';

function AudioPlayer() {
  var current = useSelector((state) => state.currentSoundcape);
  const isGraphVisualizationView = useSelector((state) => state.isGraphVisualizationView);
  var playlist = useSelector((state) => state.soundscape_Playlist);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLastTrack, setIsLastTrack] = useState(false);
  
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
  
  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };
  
  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column'
  };
  
  const modalButtonsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  };
  
  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };
  
  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2196F3',
    color: 'white'
  };
  
  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e0e0e0',
    color: 'black'
  };
  
  const jumpToFirstTrack = () => {
    if (playlist && typeof playlist === 'object') {
      const playlistArray = Object.values(playlist);
      if (playlistArray.length > 0) {
        dispatch(updateSoundscape(playlistArray[0]));
      }
    }
    setShowModal(false);
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
      setModalMessage("This is the last track in the playlist, tab a new playlist in the playlist section");
      setIsLastTrack(true);
      setShowModal(true);
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
      setModalMessage("This is the first track in the playlist, tab a new playlist in the playlist section");
      setIsLastTrack(false);
      setShowModal(true);
    } else if (currentIndex > 0) {
      dispatch(updateSoundscape(playlistArray[currentIndex - 1]));
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  return (
    <div className="audioPlayerContainer" style={containerStyle}>
      {isGraphVisualizationView && current.file_name && (
        <div className="audioTitle" style={titleStyle}>
          {current.file_name + " - " + current.FGsource}
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
      
      {/* Custom Alert Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <p>{modalMessage}</p>
            <div style={modalButtonsStyle}>
              <button 
                style={secondaryButtonStyle} 
                onClick={closeModal}>
                OK
              </button>
              {isLastTrack && (
                <button 
                  style={primaryButtonStyle} 
                  onClick={jumpToFirstTrack}>
                  Jump to Beginning of Playlist
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { AudioPlayer }