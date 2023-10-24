export const UPDATE_EVENT_PLEASANT_RANGE = 'UPDATE_EVENT_PLEASANT_RANGE';

// Action Creator
export const updateEventPleasantSliderRange = (sliderName, value, checkBox) => {
  return {
    type: UPDATE_EVENT_PLEASANT_RANGE,
    payload: {
      [sliderName]: [value[0], value[1], checkBox]
    }
  };
};