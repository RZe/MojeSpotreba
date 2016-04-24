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

import {
  REQUEST_SIGN_IN,

  REQUEST_AUTH_TOKEN,
  RECEIVE_AUTH_TOKEN,
  RECEIVE_AUTH_TOKEN_FAILED,

  SIGN_IN,
  SIGN_OUT,
  REGISTER
} from './authConstants';

function signInState() {
  return {
    type: 'SIGN_IN'
  };
}

function overviewState() {
  return {
    type: 'SIGN_IN'
  };
}


function requestAuthenticationToken() {
  return {
    type: 'REQUEST_AUTH_TOKEN'
  };
}

/**
 *  Session token
 */
function getAuthenticationToken() {
  return dispatch => {
    dispatch(requestAuthenticationToken());

    // Go to overview
    //dispatch(overviewState());

    // Actions.TabBar();

    // Clear history to prevent going 'back'
    // Actions.reset();

    // return overviewState();
  };
}

export default {
  signInState,
  overviewState,
  getAuthenticationToken
};