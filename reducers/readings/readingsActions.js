
import {
  REQUEST_READINGS,
  RECEIVE_READINGS,
  RECEIVE_READINGS_FAILED,

  REQUEST_ADD_READING,
  RECEIVE_ADD_READING,
  RECEIVE_ADD_READING_FAILED,
} from './readingsConstants';

import Api from '../../api/Api';

import navigationActions from '../navigation/navigationActions';


/**
 * Requests reading of given category.
 *
 * From and To serve to limit the readings' date range.
 *
 * @param category
 * @param from
 * @param to
 * @returns {{type: *, category: *, from: *, to: *}}
 */
function requestReadings(category, from, to) {
  return {
    type: 'REQUEST_READINGS',
    category,
    from,
    to
  };
}

function receiveReadings(data) {
  return {
    type: 'RECEIVE_READINGS',
    data
  };
}

function receiveReadingsError(error) {
  return {
    type: 'RECEIVE_READINGS_FAILED',
    error
  };
}

/**
 *  A reading is being send.
 *  @param reading
 *  @returns {{type: string, reading: *}}
 */
function requestAddReading(reading) {
  return {
    type: 'REQUEST_ADD_READING',
    reading
  };
}

/**
 *  A reading was send successfully
 *  @returns {{type: string}}
 */
function receiveAddReading() {
  return {
    type: 'RECEIVE_ADD_READING'
  };
}

/**
 *  An error occurred when sending the reading
 *  @param error
 *  @returns {{type: string, error: *}}
 */
function receiveAddReadingError(error) {
  return {
    type: 'RECEIVE_ADD_READING_ERROR',
    error
  };
}

/**
 * TODO Remove me
 * @param fields
 * @returns {{type: string, fields: *}}
 */
function createAddReadingFormFields(fields) {
  return {
    type: 'ADD_READING_FORM_CREATE',
    fields
  };
}

/**
 * Transitions to readings state.
 *
 * @param measurement
 */
function readingsState(measurement) {

}

/**
 * Adds new reading in given category for date. Data object contains reading value(s).
 *
 * @param reading
 */
function addReadingFormSubmit(reading) {
  return dispatch => {
    // Disable form submit button during this process
    dispatch(addReadingFormSubmitting());

    // Inform others that reading is being added
    dispatch(requestAddReading(reading));

    Api
      .methodPost("/reading", reading)
      .then(res => res.json())
      .then(response => {
        if (response.status == 'success') {
          // Reload measurement and dispatch receive action to notify others
          dispatch(receiveAddReading());
        }
        else {
          dispatch(receiveAddReadingError(response.error));
        }

        // Enable form submit button again
        dispatch(addReadingFormSubmitComplete());

        // Next stop is Overview page again
        // TODO Perhaps navigate to Details instead
        navigationActions.showOverview();
      })
      .catch(error => {
        dispatch(receiveAddReadingError(error));

        // Enable form submit button again
        dispatch(addReadingFormSubmitComplete());
      })
    ;
  };
}

/**
 *  Enables form Submit button
 *  @returns {{type: string}}
 */
function addReadingFormSubmitComplete() {
  return {
    type: 'ADD_READING_FORM_SUBMIT_COMPLETE'
  };
}

/**
 *  Disables form Submit button
 *  @returns {{type: string}}
 */
function addReadingFormSubmitting() {
  return {
    type: 'ADD_READING_FORM_SUBMITTING'
  };
}



export default {
  requestReadings,
  addReadingFormSubmit,
  createAddReadingFormFields
};
