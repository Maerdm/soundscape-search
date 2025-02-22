import {createStore, combineReducers } from 'redux';
import radarValues from '../components/RadarChart/reducer.js';
import {sliderRangeItems} from '../components/SliderRanges/reducer.js';
import isoRanges from '../components/ISOSlider/reducer.js';
import {soundscape_Playlist, numSoundscapeTabs, numCurrentTab, playlistType, buttonPressed, isGraphVisualizationView} from '../components/NavBar/reducer.js';
import currentSoundcape from '../components/AudioPlaylist/reducer.js';
import {storedSoundscapes} from '../components/AudioPlaylist/reducer.js';

const reducers = combineReducers({
  soundscape_Playlist,  
  numSoundscapeTabs,
  numCurrentTab,
  radarValues,
  sliderRangeItems,
  isoRanges,
  currentSoundcape,
  storedSoundscapes,
  playlistType,
  buttonPressed,
  isGraphVisualizationView
});

const store = createStore(reducers);

export {store};