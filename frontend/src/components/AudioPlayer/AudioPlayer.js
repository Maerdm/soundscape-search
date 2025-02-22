import React from 'react'
import './AudioPlayer.css';
import { useSelector } from 'react-redux';
import Player from 'react-h5-audio-player';

function AudioPlayer() {
  var current = useSelector((state) => state.currentSoundcape);
  const isGraphVisualizationView = useSelector((state) => state.isGraphVisualizationView);

  const containerStyle = {
    height: 'calc(100% - 88vh)',
    position: 'absolute',
    display: 'flex',
    bottom: 0,
    boxSizing: 'border-box',
    background: 'rgb(227, 15, 15)',
    ...(isGraphVisualizationView ? {
      // Styles for graph view
      width: '100%',
      marginLeft: 0,
      marginTop: '83vh',
      left: 0,
      right: 0
    } : {
      // Default styles
      width: '50vh',
      marginLeft: '74vh',
      marginTop: '83vh'
    })
  };

  return (
    <div className="audioPlayerContainer" style={containerStyle}>
      <div className="audioPlayer">
        <Player
          autoPlay
          src={current.audio_ip}
        />
      </div>
    </div>
  )
}

export { AudioPlayer }