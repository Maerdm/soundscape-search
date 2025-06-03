import React, { useState, useEffect } from 'react';
import {SliderSoundscapeItems} from './SliderSoundscapeItems';
import {SliderNoMarks} from './SliderNoMarks';
import './SliderSoundscapeComponent.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useSelector } from 'react-redux';

function getSliderGroup(min, max, sliderRanges){
    const keys = Object.keys(sliderRanges).slice(min, max);
    const group = {};

    for (const key of keys) {
        group[key] = sliderRanges[key];
    }
    return group
}

function SliderSoundscapeComponent() {
    
    var sliderRanges = useSelector((state) => state.sliderRangeItems);

    const [sliderPage, setSliderPage] = useState('items');
    const [colorItems, setColorItems] = useState("black");
    const [colorCompositions, setColorCompositions] = useState("black");
    const [colorAcousticFeatures, setColorAcousticFeatures] = useState("black");

    useEffect(() => {
        
        let sliderGroup = getSliderGroup(0, 8, sliderRanges);

        for (const itemName in sliderGroup) {

            const sliderRange = sliderGroup[itemName];     
            if (sliderRange[2] === true) {
                setColorItems('green')
                break;
            }
            else {setColorItems('black')}
        }

        sliderGroup = getSliderGroup(8, 16, sliderRanges);
        for (const itemName in sliderGroup) {
            const sliderRange = sliderGroup[itemName];            

            if (sliderRange[2] === true) {
                setColorCompositions('green')
                break;
            }
            else {setColorCompositions('black')}
        }

        sliderGroup = getSliderGroup(16, 23, sliderRanges);
        for (const itemName in sliderGroup) {
            const sliderRange = sliderGroup[itemName];            

            if (sliderRange[2] === true) {
                setColorAcousticFeatures('green')
                break;
            }
            else {setColorAcousticFeatures('black')}
        }
    }, [sliderRanges]);


    return (
        <div className='sliderSoundscapeItems'>
            <div className='description'>
                <p>Single soundscape items</p>
            </div>

            <div className='switchButtonsComponent'>
                <div className='switchButton'>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                onChange={(event) =>  setSliderPage(event.target.value)}
                                defaultValue={"items"}
                                checked={sliderPage}
                                name="radio-buttons-group"
                                row
                            >
                            <FormControlLabel
                                value="items"
                                control={<Radio />}
                                label={<span style={{ color: colorItems, fontSize: '12px' }}>Single items</span>}
                            />
                            <FormControlLabel
                                value="composition"
                                control={<Radio />}
                                label={<span style={{ color: colorCompositions, fontSize: '12px' }}>Soundscape composition</span>}
                            />
                            <FormControlLabel
                                value="acoustic_features"
                                control={<Radio />}
                                label={<span style={{ color: colorAcousticFeatures, fontSize: '12px' }}>Acoustic features</span>}
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                
            </div>

            <div className="sliderList">

            {sliderPage === 'items' ? (
                <>
                    <div className='sliderPleasent'>
                        <SliderSoundscapeItems name={"Pleasant"} itemName={"pleasant"} numMarks={4} sliderType="items"/>
                    </div>
                    <div className='sliderAnnoying'>
                        <SliderSoundscapeItems name={"Annoying"} itemName={"annoying"} numMarks={4} sliderType="items"/>
                    </div>
                    <div className='sliderEventful'>
                        <SliderSoundscapeItems name={"Eventful"} itemName={"eventful"} numMarks={4} sliderType="items"/>
                    </div>
                    <div className='sliderUneventful'>
                        <SliderSoundscapeItems name={"Uneventful"} itemName={"uneventful"} numMarks={4} sliderType="items"/>
                    </div>
                    <div className='sliderVibrant'>
                        <SliderSoundscapeItems name={"Vibrant"} itemName={"vibrant"} numMarks={4} sliderType="items"/>
                    </div>
                    <div className='sliderMonotonous'>
                        <SliderSoundscapeItems name={"Monotonous"} itemName={"monotonous"} numMarks={4} sliderType="items"/>
                    </div>
                    <div className='sliderChaotic'>
                        <SliderSoundscapeItems name={"Chaotic"} itemName={"chaotic"} numMarks={4} sliderType="items"/>
                    </div>
                    <div className='sliderCalm'>
                        <SliderSoundscapeItems name={"Calm"} itemName={"calm"} numMarks={4} sliderType="items"/>
                    </div>
                </>
            ) : sliderPage === 'composition' ? (
                <>
                    <div className='sliderNature'>
                        <SliderSoundscapeItems name={"Nature"} itemName={"SC_Nature"} numMarks={4} sliderType="composition"/>
                    </div>
                    <div className='sliderHuman'>
                        <SliderSoundscapeItems name={"Human"} itemName={"SC_Human"} numMarks={4} sliderType="composition"/>
                    </div>
                    <div className='sliderHousehold'>
                        <SliderSoundscapeItems name={"Household"} itemName={"SC_Household"} numMarks={10} sliderType="composition"/>
                    </div>
                    <div className='sliderInstallation'>
                        <SliderSoundscapeItems name={"Installation"} itemName={"SC_Installation"} numMarks={10} sliderType="composition"/>
                    </div>
                    <div className='sliderSignals'>
                        <SliderSoundscapeItems name={"Signals"} itemName={"SC_Signals"} numMarks={10} sliderType="composition"/>
                    </div>
                    <div className='sliderTraffic'>
                        <SliderSoundscapeItems name={"Traffic"} itemName={"SC_Traffic"} numMarks={10} sliderType="composition"/>
                    </div>
                    <div className='sliderSpeech'>
                        <SliderSoundscapeItems name={"Speech"} itemName={"SC_Speech"} numMarks={10} sliderType="composition"/>
                    </div>
                    <div className='sliderMusic'>
                        <SliderSoundscapeItems name={"Music"} itemName={"SC_Music"} numMarks={10} sliderType="composition"/>
                    </div>
                </>
            ) : (
                <>
                  <div className='sliderLAeq'>
                    <SliderNoMarks name={"LAeq"} itemName={"LAeq_default"} min={4.5} max={76.50}/>
                  </div>

                  <div className='sliderLoudness'>
                    <SliderNoMarks name={"Loudness"} itemName={"N5_default"} min={0} max={39}/>
                  </div>
                  <div className='sliderFluctuationStrength'>
                    <SliderNoMarks name={"FlucStrength"} itemName={"FavgArith_default"} min={0} max={0.86}/>
                  </div>
                  <div className='sliderRelativeApproach'>
                    <SliderNoMarks name={"RelApproach"} itemName={"RAavgArith"} min={0} max={43.2}/>
                  </div>
                  <div className='sliderSharpness'>
                    <SliderNoMarks name={"Sharpness"} itemName={"SavgArith_default"} min={0} max={5.36}/>
                  </div>
                  <div className='sliderRoughness'>
                    <SliderNoMarks name={"Roughness"} itemName={"R_default"} min={0} max={1.29}/>
                  </div>
                  <div className='sliderTonality'>
                    <SliderNoMarks name={"Tonality"} itemName={"T_default"} min={0} max={2.52}/>
                  </div>
                </>
              
            )}

            </div>
        </div>
    );
}

export {SliderSoundscapeComponent}


