import { UPDATE_SLIDER_RANGE } from './actions';

const initialStateItems = {
  pleasant: [0, 4, false],
  vibrant: [0, 4, false],
  eventful: [0, 4, false],
  chaotic: [0, 4, false],
  annoying: [0, 4, false],
  monotonous: [0, 4, false],
  uneventful: [0, 4, false],
  calm: [0, 4, false],
  
  SC_Nature: [0, 4, false],
  SC_Human: [0, 4, false],
  SC_Household: [0, 4, false],
  SC_Installation: [0, 4, false],
  SC_Signals: [0, 4, false],
  SC_Traffic: [0, 4, false],
  SC_Speech: [0, 4, false],
  SC_Music: [0, 4, false],

  LAeq_default: [0, 76.5, false],
  N5_default: [0, 39, false],
  FavgArith_default: [0, 0.86, false],
  RAavgArith: [0, 43.2, false],
  SavgArith_default: [0, 5.36, false],
  R_default: [0, 1.29, false],
  T_default: [0, 2.52, false],
};

const sliderRangeItems = (state = initialStateItems, action) => {
  switch (action.type) {
    case UPDATE_SLIDER_RANGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export {sliderRangeItems};
