'use strict';

import { combineReducers } from 'redux';

import overview from './overview/overviewReducer';
import measurements from './measurements/measurementsReducer';
import navigation from './navigation/navigationReducer';
import readings from './readings/readingsReducer';
// import auth from './auth/authReducer';


export default combineReducers({
  overview,
  measurements,
  navigation,
//auth,
  readings,
});
