import './App.css';
import { useSelector } from 'react-redux';
import RadarChart from './components/RadarChart/RadarChart';
import { Provider } from 'react-redux';
import { EventPleasantComponent } from './components/ISOSlider/EventPleasantComponent';
import { store } from './store/mainReducer';
import { AudioPlaylist } from './components/AudioPlaylist/AudioPlaylist';
import { AudioPlaylistTabs } from './components/AudioPlaylistTabs/AudioPlaylistTabs';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
import NavBar from './components/NavBar/NavBar';
import { SliderSoundscapeComponent } from './components/SliderRanges/SliderSoundscapeComponent';
import { InformationComponent } from './components/Informations/InformationComponent';

const AppContent = () => {
  const isGraphVisualizationView = useSelector((state) => state.isGraphVisualizationView);

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <div className="App">
        <div className="RadarChart">
          <NavBar />
          {/* Keep these mounted but control visibility */}
          <div style={{ display: isGraphVisualizationView ? 'none' : 'block' }}>
            <AudioPlaylist />
            <AudioPlaylistTabs />
          </div>
          <AudioPlayer />
          {/* Other components */}
          <div style={{ display: isGraphVisualizationView ? 'none' : 'block' }}>
            <RadarChart />
            <EventPleasantComponent />
            <SliderSoundscapeComponent />
            <InformationComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;