// Action Types
export const UPDATE_SOUNDSCAPE = 'UPDATE_SOUNDSCAPE';
export const STORE_SOUNDSCAPE = 'STORE_SOUNDSCAPES';
export const REMOVE_SOUNDSCAPE = 'REMOVE_SOUNDSCAPE';

// Action Creator
export const updateSoundscape = (value) => {
  return {
    type: UPDATE_SOUNDSCAPE,
    payload: value,
  };
};

export const storeSoundscape = (value) => {
  return {
    type: STORE_SOUNDSCAPE,
    payload: value,
  };
};

export const removeSoundscape = (fileName) => {
  return {
    type: REMOVE_SOUNDSCAPE,
    payload: fileName,
  };
};