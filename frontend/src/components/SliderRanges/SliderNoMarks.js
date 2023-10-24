import * as React from 'react';
import {useState, useEffect, useCallback} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { updateSliderRangeItems} from './actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

function SliderNoMarks({name, itemName, min=0, max=4, step=0.001}) {

    var currentSoundscape = useSelector((state) => state.currentSoundcape);
    var sliderRanges = useSelector((state) => state.sliderRangeItems);

    const dispatch = useDispatch();
    const [value, setValue] = useState([min, max]);
    const [checked, setChecked] = useState(false);
    
    if (currentSoundscape[itemName] === undefined) {
        currentSoundscape[itemName] = '';
    }
   
    // useEffect(() => {
    //     setValue([sliderRanges[itemName][0], currentSoundscape[itemName].toFixed(2), sliderRanges[itemName][1]]);

    // }, [currentSoundscape]);

    useEffect(() => {
        if (sliderRanges[itemName]) {
            setValue([sliderRanges[itemName][0], sliderRanges[itemName][1]]);
            setChecked(sliderRanges[itemName][2]);
        }
      }, [sliderRanges, itemName]);

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
        }, []
    );

    const handleSliderChangeCommitted = (event, newValue) => {
        //if (event.type === 'mouseup') {
            setValue((prevValue) => newValue);
            dispatch(updateSliderRangeItems(itemName, newValue, checked));
       // }
    };
    
    const handleCheckBox = (event) => {
        setChecked(event.target.checked);
        dispatch(updateSliderRangeItems(itemName, value, event.target.checked));
    };  

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative'}}>

        <FormControlLabel
            label={name}
            control={<Checkbox checked={checked} onChange={handleCheckBox} />}
            sx={{ width: '100px', marginRight: '60px', color: 'black'}}
        />

        <Box sx={{ flex: 1, marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
            <Slider
                value={value}
                onChange={handleChange}
                onChangeCommitted={handleSliderChangeCommitted}
                valueLabelDisplay="on"//{checked ? "on" : "auto"} 
                // valueLabelFormat={(value, index) => (index === 1 ? value.toFixed(2) : '')}
                min={min}
                max={max}
                step={step}
                disableSwap
            />
            {/* <Box sx={{ marginRight: '15px', marginLeft: '10px', minWidth: '50px', textAlign: 'right' }}>
            <div> {currentSoundscape[itemName].toFixed(2)}</div>
            </Box> */}

            {typeof currentSoundscape[itemName] === 'number' ? (
                <Box sx={{ marginRight: '15px', marginLeft: '10px', minWidth: '50px', textAlign: 'right' }}>
                    <div> {currentSoundscape[itemName].toFixed(2)}</div>
                </Box>
                ) : (
                <Box sx={{ marginRight: '15px', marginLeft: '10px', minWidth: '50px', textAlign: 'right' }}>
                    <div>----</div>
                </Box>
            )}
        </Box>
        
        </Box>
    );
}

export{SliderNoMarks}