import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import {updateSoundscapePlaylist, resetReducer,  updatebuttonPressed} from './actions';

function UploadButton({buttonText="default", fontColor="black", backGroundColor="white", borderColor="white"}) {

    const dispatch = useDispatch();
    const [soundscapes, updateSoundscapes] = useState(0);

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first selected file

        if (file) {
            event.target.value = null;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                const jsonContent = JSON.parse(event.target.result);
                updateSoundscapes(jsonContent)
                dispatch(updatebuttonPressed("load"))
                dispatch(resetReducer());
                } catch (error) {
                console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    useEffect(() => {dispatch(updateSoundscapePlaylist(soundscapes))}, [dispatch, soundscapes]);

    return (
        <div>
            <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="fileInput"
            padding='1px 0px'
            />
            <label htmlFor="fileInput">
                <Button variant="outlined" component="span" sx={{ mr: 2, fontSize: '10px', padding: '1px 0px', paddingLeft: '0px', color: fontColor, backgroundColor: backGroundColor, borderColor: borderColor, 
                    '&:hover': {borderColor: borderColor},}}>{buttonText}
                </Button>
            </label>

        </div>
    );
}

export {UploadButton}
