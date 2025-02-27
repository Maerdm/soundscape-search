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
import GraphVisualization from './components/GraphVisualization/GraphVisualization'; // Import the new component

const AppContent = () => {
  const isGraphVisualizationView = useSelector((state) => state.isGraphVisualizationView);
  
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <div className="App">
        <div className="RadarChart">
          <NavBar />
          
          {/* Regular components shown when graph visualization is off */}
          <div style={{ display: isGraphVisualizationView ? 'none' : 'block' }}>
            <AudioPlaylist />
            <AudioPlaylistTabs />
          </div>
          
          <AudioPlayer />
          
          {isGraphVisualizationView ? (
            <div style={{
              position: 'absolute',
              top: '48px', // Reduced from 60px to match NavBar height exactly
              left: 0,
              right: 0,
              bottom: '60px',
              overflow: 'hidden',
              margin: 0, // Explicitly set margin to 0
            }}>
              <GraphVisualization />
            </div>
          ) : (
            <div>
              <RadarChart />
              <EventPleasantComponent />
              <SliderSoundscapeComponent />
              <InformationComponent />
            </div>
          )}
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