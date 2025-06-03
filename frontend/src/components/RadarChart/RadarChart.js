import Radar from 'react-d3-radar';
import {Slider} from './Slider';
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateSliderValue } from './actions';
import './RadarContainer.css';

function RadarChart() {

    const dispatch = useDispatch();
    var current = useSelector((state) => state.currentSoundcape);
    var buttonPressed = useSelector((state) => state.buttonPressed);

    const [pleasant_slider, setPleasant_slider] = useState(2);
    const [vibrant_slider, setVibrant_slider] = useState(2);
    const [eventful_slider, setEventful_slider] = useState(2);
    const [chaotic_slider, setChaotic_slider] = useState(2);
    const [annoying_slider, setAnnoying_slider] = useState(2);
    const [monotonous_slider, setMonotonous_slider] = useState(2);
    const [uneventful_slider, setUneventful_slider] = useState(2);
    const [calm_slider, setCalm_slider] = useState(2);

    const [pleasant_vector, setPleasant_vector] = useState(0);
    const [vibrant_vector, setVibrant_vector] = useState(0);
    const [eventful_vector, setEventful_vector] = useState(0);
    const [chaotic_vector, setChaotic_vector] = useState(0);
    const [annoying_vector, setAnnoying_vector] = useState(0);
    const [monotonous_vector, setMonotonous_vector] = useState(0);
    const [uneventful_vector, setUneventful_vector] = useState(0);
    const [calm_vector, setCalm_vector] = useState(0);

    useEffect(() => {
        if (Object.keys(current).length === 0) {}
        else {
            setPleasant_vector(current.pleasant); setVibrant_vector(current.vibrant); setEventful_vector(current.eventful);
            setChaotic_vector(current.chaotic); setAnnoying_vector(current.annoying); setMonotonous_vector(current.monotonous);
            setUneventful_vector(current.uneventful); setCalm_vector(current.calm)
        };   
    }, [current])

    useEffect(() => {
        dispatch(updateSliderValue({pleasant_slider, vibrant_slider, eventful_slider, chaotic_slider, annoying_slider, monotonous_slider, uneventful_slider, calm_slider}));
    }, [dispatch, pleasant_slider, vibrant_slider, eventful_slider, chaotic_slider, annoying_slider, monotonous_slider, uneventful_slider, calm_slider]);

    useEffect(() => {
        if(buttonPressed === "slider"){
            setPleasant_slider(0); setVibrant_slider(0); setEventful_slider(0); setChaotic_slider(0); setAnnoying_slider(0); setMonotonous_slider(0); setUneventful_slider(0); setCalm_slider(0);
        }
    }, [buttonPressed])

    const onSliderChange = (e) => {
        if (e.className === "pleasant"){setPleasant_slider(parseFloat(e.value))}
        if (e.className === "vibrant"){setVibrant_slider(parseFloat(e.value))}
        if (e.className === "eventful"){setEventful_slider(parseFloat(e.value))}
        if (e.className === "chaotic"){setChaotic_slider(parseFloat(e.value))}
        if (e.className === "annoying"){setAnnoying_slider(parseFloat(e.value))}
        if (e.className === "monotonous"){setMonotonous_slider(parseFloat(e.value))}
        if (e.className === "uneventful"){setUneventful_slider(parseFloat(e.value))}
        if (e.className === "calm"){setCalm_slider(parseFloat(e.value))}
    }

    return (
        <div className="radarContainer"> 

                <Slider name="eventful"currentValue={eventful_slider} onChange={(e) => onSliderChange(e.target)}/>
                <Slider name="vibrant" currentValue={vibrant_slider} onChange={(e) => onSliderChange(e.target)}/>
                <Slider name="pleasant" currentValue={pleasant_slider} onChange={(e) => onSliderChange(e.target)}/>
                <Slider name="calm"currentValue={calm_slider} onChange={(e) => onSliderChange(e.target)}/>
                <Slider name="uneventful"currentValue={uneventful_slider} onChange={(e) => onSliderChange(e.target)}/>
                <Slider name="monotonous"currentValue={monotonous_slider} onChange={(e) => onSliderChange(e.target)}/>
                <Slider name="annoying"currentValue={annoying_slider} onChange={(e) => onSliderChange(e.target)}/>
                <Slider name="chaotic" currentValue={chaotic_slider} onChange={(e) => onSliderChange(e.target)}/>

            <div className="radarChart">
               <Radar
                    width={400}
                    height={400}
                    padding={4} 
                    domainMax={4}
                    highlighted={null}
                    numRings={4}
                    fillAll={false}

                    data={{
                        variables: [
                        {key: 'eventful', label: 'eventful'},
                        {key: 'vibrant', label: 'vibrant'},
                        {key: 'pleasant', label: 'pleasant'},
                        {key: 'calm', label: 'calm'},
                        {key: 'uneventful', label: 'uneventful'},
                        {key: 'monotonous', label: 'monotonous'},
                        {key: 'annoying', label: 'annoying'},
                        {key: 'chaotic', label: 'chaotic'},
                        ],
                        sets: [
                        {
                            key: 'query_vector',
                            label: 'query_vector',
                            color: 'blue',
                            
                            values: {
                                pleasant: pleasant_slider,
                                vibrant: vibrant_slider,
                                eventful: eventful_slider,
                                chaotic: chaotic_slider,
                                annoying: annoying_slider,
                                monotonous: monotonous_slider,
                                uneventful: uneventful_slider,
                                calm: calm_slider,
                            },
                        },
                        {
                            key: 'soundscape_vector',
                            label: 'soundscape_vector',
                            color: 'green',
                            
                            values: {
                                pleasant: pleasant_vector,
                                vibrant: vibrant_vector,
                                eventful: eventful_vector,
                                chaotic: chaotic_vector,
                                annoying: annoying_vector,
                                monotonous: monotonous_vector,
                                uneventful: uneventful_vector,
                                calm: calm_vector,
                            },
                        }
                        
                        ],
                    }}
                />
            </div>
        </div>
      );
}

export default RadarChart