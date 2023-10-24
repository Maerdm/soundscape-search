// Action Types
export const UPDATE_SLIDER_VALUE = 'UPDATE_SLIDER_VALUE';

// Action Creator
export const updateSliderValue = (value) => {
  return {
    type: UPDATE_SLIDER_VALUE,
    payload: value,
  };
};