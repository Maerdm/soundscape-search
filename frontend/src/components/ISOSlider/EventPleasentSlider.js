import * as React from 'react';
import {useState, useCallback} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { updateEventPleasantSliderRange } from './actions';
import { useDispatch } from 'react-redux';

function EventPleasantSlider({name, itemName, pleasantEventVal}) {

  const dispatch = useDispatch();
  const [value, setValue] = useState([0.0, 4.0]);
  const [checked, setChecked] = useState(false);

  const handleChange = useCallback((event, newValue) => {
      setValue((prevValue) => newValue);
      dispatch(updateEventPleasantSliderRange(itemName, newValue, checked));
    },
    [dispatch, itemName, checked]
  );

  const handleCheckBox = (event) => {
    setChecked(event.target.checked);
    dispatch(updateEventPleasantSliderRange(itemName, value, event.target.checked));
  };  

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative'}}>
      <FormControlLabel
        label={name}
        control={<Checkbox checked={checked} onChange={handleCheckBox} />}
        sx={{ width: '180px', marginRight: '25px', color: 'black'}}
      />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Slider
            value={value}
            onChange={handleChange}
            valueLabelDisplay="on" //{checked ? "on" : "auto"} 
            min={0.0}
            max={4.0}
            step={0.001}
            disableSwap
          />
        {typeof pleasantEventVal === 'number' ? (
          <Box sx={{ marginRight: '15px', marginLeft: '1px', minWidth: '50px', textAlign: 'right' }}>
            {<div>{pleasantEventVal.toFixed(2)}</div>}
          </Box>
        ) : (
          <Box sx={{ marginRight: '15px', marginLeft: '1px', minWidth: '50px', textAlign: 'right' }}>
            <div>----</div>
          </Box>
        )}
      </Box>  
    </Box>
  );
}

export{EventPleasantSlider}