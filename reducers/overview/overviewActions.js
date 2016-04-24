
import {
  REQUEST_OVERVIEW,
  RECEIVE_OVERVIEW,
  RECEIVE_OVERVIEW_FAILED
} from './overviewConstants';

function requestOverview() {
  return {
    type: 'REQUEST_OVERVIEW'
  };
}

function receiveOverview(data) {
  return {
    type: 'RECEIVE_OVERVIEW',
    data
  };
}

function receiveOverviewError(error) {
  return {
    type: 'RECEIVE_OVERVIEW_FAILED',
    error
  };
}

export default {
  requestOverview
};
