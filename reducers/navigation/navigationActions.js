/**
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

import { Actions } from 'react-native-router-flux';


function overviewState() {
  return {
    type: 'OVERVIEW'
  };
}

function detailsState(measurement) {
  return {
    type: 'DETAILS',
    data: {
      measurement
    }
  };
}

function readingsState(measurement) {
  return {
    type: 'READINGS',
    data: {
      measurement
    }
  };
}

function addReadingState(measurement) {
  return {
    type: 'ADD_READING',
    data: {
      measurement
    }
  }
}

function showOverview() {
  Actions.Overview();
  return overviewState();
}

function showReadings(measurement) {
  Actions.Readings({ measurement });
  
  return readingsState(measurement);
}

function showDetails(measurement) {
  return dispatch => {
    dispatch(detailsState(measurement));
    Actions.Details({ measurement });
  };
}


function showAddReading(measurement) {
  return dispatch => {
    dispatch(addReadingState(measurement));

    // FIXME For some reason this call prevent return from execution. Nothing after this line gets executed.
    Actions.AddReading({ measurement });

    return addReadingState(measurement);
  };
}

export default {
  showAddReading,
  showReadings,
  showOverview,
  showDetails
}
