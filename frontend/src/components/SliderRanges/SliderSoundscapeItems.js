import * as React from 'react';
import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';
import { updateSliderRangeItems} from './actions';
import { useDispatch } from 'react-redux';

const itemMarker = Array.from({ length: 5 }, (_, index) => ({
  value: index, label: <span style={{ color: `rgba(0, 0, 0, 0.28)` }}>{(index)}</span>,
}));

const compositionMarker = Array.from({ length: 11 }, (_, index) => ({
  value: index * 0.4 , label: <span style={{ color: `rgba(0, 0, 0, 0.28)` }}>{(index * 0.4).toFixed(1)}</span>,
}));

let marker = [];
let step  = 1;

function SliderSoundscapeItems({name, itemName, sliderType="items"}) {

  if (sliderType==="items") {
    marker = itemMarker
    step = 1;
  }
  if (sliderType==="composition") {
    marker = compositionMarker
    step = 0.4;
  }

  var currentSoundscape = useSelector((state) => state.currentSoundcape);
  var sliderRanges = useSelector((state) => state.sliderRangeItems);

  const dispatch = useDispatch();
  const [value, setValue] = useState([0, 4]);
  const [marks, setMarks] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sliderRanges[itemName]) {
        setValue([sliderRanges[itemName][0], sliderRanges[itemName][1]]);
        setChecked(sliderRanges[itemName][2]);
    }
  }, [sliderRanges, itemName]);


  // this useEffect updates the alpha of the marker based on current.itemName
  useEffect(() => {
    if (Object.keys(currentSoundscape).length === 0) {
      setMarks(marker);
    } 
    else {

      const tolerance = 0.0001;
      const targetIndex = marker.findIndex((mark) =>
        Math.abs(mark.value - currentSoundscape[itemName]) < tolerance
      );

      const newMarker = marker.map((mark, index) => {
        if (index === targetIndex) { 
          let markRounded;
          if(sliderType==="composition") { markRounded = (mark.value).toFixed(1)}
          else {markRounded = (mark.value).toFixed(0)}

          return {...mark,
            label: <span style={{ color: `rgba(0, 0, 0, ${1})`}}>{markRounded}</span>,
          };
        } else {
          return mark;
        }
      });
      setMarks(newMarker);
    }
  }, [currentSoundscape, itemName, sliderType]);

  const handleSliderChangeCommitted = (event, newValue) => {
    //if (event.type === 'mouseup') {
      dispatch(updateSliderRangeItems(itemName, newValue, checked));
    //}
  };
  
  const handleChange = (event, newValue) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    setValue(newValue);
    setMarks(marker);
  };

  const handleCheckBox = (event) => {
    setChecked(event.target.checked);
    dispatch(updateSliderRangeItems(itemName, value, event.target.checked));
  };  

  return (

      <Box sx={{ width: 1070, display: 'flex', alignItems: 'center', position: 'relative'}}>

        <FormControlLabel
          label={name}
          control={<Checkbox checked={checked} onChange={handleCheckBox} />}
          sx={{ width: '300px', marginRight: '1px', color: 'black'}}
        />
            
        <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="off"
          onChangeCommitted={handleSliderChangeCommitted}
          min={0}
          max={4}
          step={step}
          marks={marks}
          disableSwap
        />
      </Box>
  );
}

export {SliderSoundscapeItems}
