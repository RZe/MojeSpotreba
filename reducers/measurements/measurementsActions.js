/**
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

import Api from '../../api/Api';
import measurementUtils from '../../utils/measurementUtils';


function requestMeasurements() {
  return {
    type: 'REQUEST_MEASUREMENTS'
  };
}

function receiveMeasurements(data) {
  return {
    type: 'RECEIVE_MEASUREMENTS',
    data
  };
}

function receiveMeasurementsError(error) {
  return {
    type: 'RECEIVE_MEASUREMENTS_FAILED',
    error
  };
}

function requestMeasurement(id) {
  return {
    type: 'REQUEST_MEASUREMENT',
    id
  };
}

function receiveMeasurement(data) {
  return {
    type: 'RECEIVE_MEASUREMENT',
    data
  };
}

function receiveMeasurementError(error) {
  return {
    type: 'RECEIVE_MEASUREMENT_FAILED',
    error
  };
}


function getMeasurements(fetchReadings) {
  fetchReadings = fetchReadings || false;

  return dispatch => {
    dispatch(requestMeasurements());

    Api
      .methodGet('/measurement')
      .then(res => res.json())
      .then(response => {
        if (response.status === 'success') {
          // Request also readings from the measurements fetched
          if (fetchReadings) {
            response.measurements.forEach(measurement => {
              dispatch(getMeasurement(measurement._id));
            });
          }

          return receiveMeasurements(response.measurements);
        }
        else {
          return receiveMeasurementsError(response.error);
        }
      })
      .then(action => dispatch(action))
      .catch(error => dispatch(receiveMeasurementsError(error)))
    ;
  };
}

function getMeasurement(id) {
  return dispatch => {
    dispatch(requestMeasurement(id));

    Api
      .methodGet('/measurement/' + id)
      .then(res => res.json())
      .then(response => {
        if (response.status === 'success') {
          const readingsConsumption = measurementUtils.getReadingsConsumption(response.measurement.readings);
          const readingsTrending = measurementUtils.getReadingsTrending(readingsConsumption);

          const measurement = Object.assign({}, response.measurement, {
            readings: readingsTrending
          });

          return receiveMeasurement(measurement);
        }
        else {
          return receiveMeasurementError(response.error);
        }
      })
      .then(action => dispatch(action))
      .catch(error => dispatch(receiveMeasurementError(error)))
    ;

  };
}


export default {
  getMeasurements,
  getMeasurement
};

