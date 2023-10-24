import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {baseurl} from '../../ip_config.js'

const api_setDatabase = axios.create({baseURL: `${baseurl}setDatabase`})

function SelectDataset() {

  const [dataset, setDataset] = useState('dataset_final');
  const [allDatasets, setAllDatasets] = useState(['dataset_final']);

  const handleChange = (event) => {
    setDataset(event.target.value);
  };

  // gets all databases from backend and also sets new database
  useEffect(() => {
    api_setDatabase.post('', {dataset})
    .then(response => { 
      setAllDatasets(response.data);
    })
    .catch((error) => {
        const response = error.response
        console.log(response)
    });  
  }, [dataset])

  return (
    <Box sx={{ minWidth: 12 }}>
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            height: '30px', // Adjust the height value as needed
            color: 'rgb(0, 0, 0)',
            '&.Mui-focused': {
              color: 'rgb(0, 0, 0)'
            },

          }}
        >
          Dataset
        </InputLabel >

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dataset}
          label="Dataset"
          onChange={handleChange}
          
          sx={{
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #484850",
              borderRadius: "4px 4px 4px 4px"
            },
            height: '30px',
          }}
        >
          {allDatasets.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export { SelectDataset };
