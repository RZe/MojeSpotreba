/**
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

const initialState = {
  data: [],
  isLoading: false,
  error: false
};

export default function measurements(state = initialState, action) {
  switch (action.type) {

  // List of measurements

    case 'REQUEST_MEASUREMENTS':
      return Object.assign({}, state, {
        isLoading: true,
        error: false
      });

    case 'RECEIVE_MEASUREMENTS':
      return Object.assign({}, state, {
        data: action.data,
        isLoading: false,
        error: false
      });

    case 'RECEIVE_MEASUREMENTS_FAILED':
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });

  // Single measurement including readings

    case 'REQUEST_MEASUREMENT':
      return Object.assign({}, state, {
        isLoading: true,
        error: false
      });

    case 'RECEIVE_MEASUREMENT':
      let newState = Object.assign({}, state, {
        isLoading: false,
        error: false
      });

      let replaced = false;

      // Find measurement in the array of measurements and replace it.
      newState.data.forEach((measurement, i) => {
        if (!replaced && measurement._id == action.data._id) {
          newState.data[i] = action.data;
          replaced = true;
        }
      });

      if (!replaced) {
        newState.data.push(action.data);
      }

      return newState;

    case 'RECEIVE_MEASUREMENT_FAILED':
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });

    default:
      return state;
  }
}

