const initialState = []
const soundscape_Playlist = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SOUNDSCAPE_PLAYLIST':
      return {
        ...state,
        ...action.payload,
      };
    case 'RESET_REDUCER':
      return initialState;
    default:
      return state;
  }
};
export{soundscape_Playlist};

const initialNum = 1
const numSoundscapeTabs = (state = initialNum, action) => {
  switch (action.type) {
    case 'UPDATE_NUM_TABS':
      return action.payload;
    default:
      return state;
  }
};
export{numSoundscapeTabs};

const initialTab = 1
const numCurrentTab = (state = initialTab, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_TAB':
      return action.payload;
    default:
      return state;
  }
};
export{numCurrentTab};

const initialPlaylistType = true;
const playlistType = (state = initialPlaylistType, action) => {
  switch (action.type) {
    case 'UPDATE_PLAYLIST_TYPE':
      return action.payload; // Return the new value directly
    default:
      return state;
  }
};
export {playlistType}

const initialbuttonPressed = [''];
const buttonPressed = (state = initialbuttonPressed, action) => {
  switch (action.type) {
    case 'UPDATE_BUTTON_PRESSED':
      return action.payload; // Return the new value directly

    default:
      return state;
  }
};
export {buttonPressed}
