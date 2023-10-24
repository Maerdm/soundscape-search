import { UPDATE_SLIDER_VALUE} from './actions';

const initialState = {
  pleasant_slider: 3,
  vibrant_slider: 3,
  eventful_slider: 3,
  chaotic_slider: 3,
  annoying_slider: 3,
  monotonous_slider: 3,
  uneventful_slider: 3,
  calm_slider: 3,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SLIDER_VALUE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
