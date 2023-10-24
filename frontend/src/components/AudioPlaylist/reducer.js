import { UPDATE_SOUNDSCAPE, STORE_SOUNDSCAPE, REMOVE_SOUNDSCAPE } from './actions';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    
    case UPDATE_SOUNDSCAPE:
      return {
        ...state,
        ...action.payload,
      };
      
    default:
      return state;
  }
};

export default reducer;

const initialStore = {soundscapes: []};

const storedSoundscapes = (state = initialStore, action) => {
  switch (action.type) {

    case STORE_SOUNDSCAPE:
      return {
        ...state,
        soundscapes: [...state.soundscapes, action.payload],
      };

    case REMOVE_SOUNDSCAPE: 
      return {
        ...state,
        soundscapes: state.soundscapes.filter(item => item.file_name !== action.payload),
      };

    default:
      return state;
  }
};

export {storedSoundscapes}
