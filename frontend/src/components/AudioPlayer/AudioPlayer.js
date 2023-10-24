import React from 'react'
import './AudioPlayer.css';
import { useSelector } from 'react-redux';
import Player from 'react-h5-audio-player';

function AudioPlayer(){
  
  var current = useSelector((state) => state.currentSoundcape);

  return (
      <div className="audioPlayerContainer">
        <div className="audioPlayer">
        <Player
            autoPlay
            src={current.audio_ip}
            // onPlay={e => console.log("onPlay", current)}
          />
        </div>  
    </div>
  )

 
}

export {AudioPlayer}