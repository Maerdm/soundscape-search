import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {updateSoundscapePlaylist, updatePlaylistType, resetReducer,  updatebuttonPressed} from './actions';
import {useState, useEffect} from 'react';
import InputBase from '@mui/material/InputBase';
import { styled} from '@mui/material/styles';
import {baseurl} from '../../ip_config.js'

const api_textSearch = axios.create({baseURL: `${baseurl}soundScapesTextSearch`})

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));
  
function TextSearch() {

    const dispatch = useDispatch();
    const [soundscapes, updateSoundscapes] = useState();
    const [inputValue, setInputValue] = useState('');
    const searchText = {searchSoundscape: 'none'};
    const playlist_Type = useSelector((state) => state.playlistType);

    const onEnter = (textInput) => {

      if (!playlist_Type){
        dispatch(updatePlaylistType(true));
      }

      searchText.searchSoundscape = String(textInput)
      dispatch(updatebuttonPressed("text"))

      dispatch(resetReducer());

      api_textSearch.post('', searchText)
      .then(response => {
        updateSoundscapes(response.data)
      })
      .catch((error) => {
          const response = error.response
          console.log(response)
      });  
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {onEnter(inputValue)}
    };

    useEffect(() => {dispatch(updateSoundscapePlaylist(soundscapes))}, [dispatch, soundscapes]);

    return (
        <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
    );
}

export {TextSearch};
