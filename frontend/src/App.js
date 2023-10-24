import './App.css';
// import { useState, useEffect } from 'react';
import RadarChart from './components/RadarChart/RadarChart';
import { Provider } from 'react-redux';
import {EventPleasantComponent} from './components/ISOSlider/EventPleasantComponent';
import {store} from './store/mainReducer';
import {AudioPlaylist} from './components/AudioPlaylist/AudioPlaylist';
import {AudioPlaylistTabs} from './components/AudioPlaylistTabs/AudioPlaylistTabs';
import {AudioPlayer} from './components/AudioPlayer/AudioPlayer';
import NavBar from './components/NavBar/NavBar';
import {SliderSoundscapeComponent} from './components/SliderRanges/SliderSoundscapeComponent';
import {InformationComponent} from './components/Informations/InformationComponent';


function App() {

  // const [width, setWidth] = useState(false);
  // const [height, setHeight] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWidth(window.innerWidth <= 800); // Adjust the breakpoint as needed
  //     setHeight(window.innerHeight <= 600); // Adjust the breakpoint as needed
  //   };

  //   window.addEventListener('resize', handleResize);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);


  // if (width || height) {
  //   return (
  //     <div className="mobileMessage">
  //       <h1>Use only full screen size</h1>
  //       <h1>No mobile support</h1>
  //     </div>
  //   );
  // }

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
    <div className="App">
          <div className="RadarChart"> 
          
            <Provider store={store}>
              <NavBar />
              <RadarChart />
              <AudioPlaylist />
              <AudioPlaylistTabs />
              <AudioPlayer />
              <EventPleasantComponent />
              <SliderSoundscapeComponent />
              <InformationComponent />
            </Provider>
          </div>
    </div>
    </div>
  );
}

export default App;
