import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {updateSoundscapePlaylist, updateNumSoundscapeTabs, updatePlaylistType, resetReducer,  updatebuttonPressed, toggleGraphView} from './actions';
import {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {baseurl} from '../../ip_config.js'

const api_radarChart = axios.create({baseURL: `${baseurl}soundScapesNearestNeighbour`})
const api_isoRanges = axios.create({baseURL: `${baseurl}soundScapesIsoRanges`})
const api_sliderRanges = axios.create({baseURL: `${baseurl}soundScapesSliderRanges`})
const api_downloadPlaylist = axios.create({baseURL: `${baseurl}downloadPlaylist`})
const api_savePlaylist = axios.create({baseURL: `${baseurl}savePlaylist`})

function renameKeys(sliderValues){
  // in Dataset eg. pleasant is named FGpleasant, change keys according to dataset
  const sliderValues_newKeys = {};
  for (const key in sliderValues) {
    let newKey = key.replace("_slider", "");
    newKey = `${key.charAt(0)}${newKey.slice(1)}`;
    sliderValues_newKeys[newKey] = sliderValues[key];
  }
  return sliderValues_newKeys
}

function checkIfSlidersAreSelected(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const array = obj[key];
      const lastElement = array[array.length - 1];
      if (lastElement !== false) {
        return true;
      }
    }
  }
  return false;
}

function NavBarButton({ buttonText="default", fontColor="black", backGroundColor="white", borderColor="white", func="b"}) {

  const dispatch = useDispatch();
  var playlistStored = useSelector((state) => state.storedSoundscapes);
  var radarValues = useSelector((state) => state.radarValues);
  var isoRanges = useSelector((state) => state.isoRanges);
  var sliderRangeItems = useSelector((state) => state.sliderRangeItems);
  var currentSoundscape = useSelector((state) => state.currentSoundcape);
  const playlist_Type = useSelector((state) => state.playlistType);

  const [soundscapes, updateSoundscapes] = useState(0);
  const [numSoundscapeTabs, updateNumTabs] = useState(1);

  const handleClick = (func) => {

    // toggle Graph View
    if(func === "featureGraphVisualization"){
      dispatch(toggleGraphView()); // toggle graph View in frontend
      console.log(currentSoundscape)
    }

    // Save Playlist
    if(func === "save"){

      if(playlistStored.soundscapes.length === 0){
        window.alert('Playlist Empty!');
        return;
      };

      api_savePlaylist.post('', playlistStored.soundscapes, { responseType: 'arraybuffer' })
      .then(response => {
        const blob = new Blob([response.data], { type: 'text/json' });  // Change media type to 'text/csv'
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "soundscapes.json";  // Update the filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => {
          console.error("An error occurred:", error);
      });
    }

    // Download Playlist
    if(func === "exportToFile"){

      if(playlistStored.soundscapes.length===0){
        window.alert('Playlist Empty!');
        return;
      };

      api_downloadPlaylist.post('', playlistStored.soundscapes, { responseType: 'arraybuffer' })
      .then(response => {
          const blob = new Blob([response.data], { type: 'application/zip' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "playlist.zip";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      })
      .catch(error => {
          console.error("An error occurred:", error);
      });
    }

    // Toggle between Search Playlist and Stored Playlist
    if(func === "storedPlaylist"){
      if (playlist_Type === true ){
        dispatch(updatePlaylistType(false))
      }
      else {
        dispatch(updatePlaylistType(true))
      } 
    }

    // Radar Requests
    if(func === "radarRequest"){
      var request = renameKeys(radarValues)

      if (!playlist_Type){
        dispatch(updatePlaylistType(true));
      }

      dispatch(updatebuttonPressed(["radar"]));
      dispatch(resetReducer());

      api_radarChart.post('', request)
        .then(response => { 
          updateSoundscapes(response.data)
        })
        .catch((error) => {
            const response = error.response
            console.log(response)
      });  
    }

    // ISO Requests
    if(func === "isoRequest"){

      if(!checkIfSlidersAreSelected(isoRanges)){
        window.alert('Please select ISO Sliders!');
        return;
      };
      if (!playlist_Type){
        dispatch(updatePlaylistType(true));
      }

      dispatch(updatebuttonPressed(["iso_slider"]));
      dispatch(resetReducer());
      
      api_isoRanges.post('', isoRanges)
        .then(response => { 
          updateNumTabs(response.data.num_soundscapes_tabs)
          updateSoundscapes(response.data.soundscapes)
        })
        .catch((error) => {
            const response = error.response
            console.log(response)
      });  
    }

    // Slider Requests
    if(func === "sliderRequest"){
      if(!checkIfSlidersAreSelected(sliderRangeItems)){
        window.alert('Please select one or more Slider Items!');
        return;
      };
      if (!playlist_Type){
        dispatch(updatePlaylistType(true));
      }

      dispatch(updatebuttonPressed(["slider"]));
      dispatch(resetReducer());

      api_sliderRanges.post('', sliderRangeItems)
        .then(response => { 
          updateNumTabs(response.data.num_soundscapes_tabs)
          updateSoundscapes(response.data.soundscapes)
        })
        .catch((error) => {
            const response = error.response
            console.log(response)
      });  
    }
  };


  useEffect(() => {
    dispatch(updateSoundscapePlaylist(soundscapes))
    dispatch(updateNumSoundscapeTabs(numSoundscapeTabs))
  
  }, [dispatch, soundscapes, numSoundscapeTabs]);
    
  return (
    <div>
      <Button variant="outlined" sx={{ mr: 2, fontSize: '10px', padding: '1px 0px', color: fontColor, backgroundColor: backGroundColor, borderColor: borderColor, 
        '&:hover': {
          borderColor: borderColor,
        },
      }} onClick={() => handleClick(func)}>{buttonText}</Button>
    </div>
  );
}

export {NavBarButton};
