// Action Types
// export const UPDATE_SOUNDSCAPE_PLAYLIST = 'UPDATE_SOUNDSCAPE_PLAYLIST';
// export const RESET_REDUCER = 'UPDATE_SOUNDSCAPE_PLAYLIST';

// Action Creator
export const updateSoundscapePlaylist = (value) => {
  return {
    type: 'UPDATE_SOUNDSCAPE_PLAYLIST',
    payload: value,
  };
};

export const updateNumSoundscapeTabs = (value) => {
  return {
    type: 'UPDATE_NUM_TABS',
    payload: value,
  };
};

export const updateCurrentTab = (value) => {
  return {
    type: 'UPDATE_CURRENT_TAB',
    payload: value,
  };
};

export const updatePlaylistType = (value) => {
  return {
    type: 'UPDATE_PLAYLIST_TYPE',
    payload: value,
  };
};

export const resetReducer = () => {
  return {
    type: 'RESET_REDUCER',
  };
};

export const updatebuttonPressed = (value) => {
  return {
    type: 'UPDATE_BUTTON_PRESSED',
    payload: value,
  };
};