export const UPDATE_SLIDER_RANGE = 'UPDATE_SLIDER_RANGE';

// Action Creator
export const updateSliderRangeItems = (sliderName, value, checkBox) => {
  return {
    type: UPDATE_SLIDER_RANGE,
    payload: {
      [sliderName]: [value[0], value[1], checkBox]
    }
  };
};