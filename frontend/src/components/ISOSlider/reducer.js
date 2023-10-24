import { UPDATE_EVENT_PLEASANT_RANGE } from './actions';

const initialState = {
  ISO_Pleasantness: [0, 4, false],
  ISO_Eventfulness: [0, 4, false],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EVENT_PLEASANT_RANGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
