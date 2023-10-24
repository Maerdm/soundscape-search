
import { useSelector } from 'react-redux';
import {useState, useEffect} from 'react';

import {EventPleasantSlider} from './EventPleasentSlider';
import './EventPleasantComponent.css';

// function calculateEventfulnessPleaseantness(r) {

//   let eventfullnessMin = ((r.FGeventful[0] - r.FGuneventful[0]) + Math.cos(45) * (r.FGchaotic[0] - r.FGcalm[0]) + Math.cos(45) * (r.FGvibrant[0] - r.FGmonotonous[0])) * (1 / (4 + Math.sqrt(32)));
//   let eventfullnessMax = ((r.FGeventful[1] - r.FGuneventful[1]) + Math.cos(45) * (r.FGchaotic[1] - r.FGcalm[1]) + Math.cos(45) * (r.FGvibrant[1] - r.FGmonotonous[1])) * (1 / (4 + Math.sqrt(32)));
  
//   let pleasantnessMin = ((r.FGpleasant[0] - r.FGannoying[0]) + Math.cos(45) * (r.FGcalm[0] - r.FGchaotic[0]) + Math.cos(45) * (r.FGvibrant[0] - r.FGmonotonous[0])) * (1 / (4 + Math.sqrt(32)));
//   let pleasantnessMax = ((r.FGpleasant[1] - r.FGannoying[1]) + Math.cos(45) * (r.FGcalm[1] - r.FGchaotic[1]) + Math.cos(45) * (r.FGvibrant[1] - r.FGmonotonous[1])) * (1 / (4 + Math.sqrt(32)));

// }

function EventPleasantComponent() {

  var currentSoundscape = useSelector((state) => state.currentSoundcape);
  const [pleasantness, setPleasantness] = useState('');
  const [eventfulness , setEventfulness ] = useState('');

  useEffect(() => {
    if (Object.keys(currentSoundscape).length === 0) {}
    else {
        setPleasantness(currentSoundscape.ISO_Pleasantness); 
        setEventfulness(currentSoundscape.ISO_Eventfulness)
    };   
  }, [currentSoundscape])

  return (
      <div className="sliderIso"> 
        <div className='sliderPleasantness'>
          <EventPleasantSlider name={"ISO pleasantness"} itemName={"ISO_Pleasantness"} pleasantEventVal={pleasantness}/>
        </div>

        <div className='sliderEventfullness'>
          <EventPleasantSlider name={"ISO eventfulness"}  itemName={"ISO_Eventfulness"} pleasantEventVal={eventfulness}/>
        </div>
      </div>
      
    );
}

export {EventPleasantComponent};

