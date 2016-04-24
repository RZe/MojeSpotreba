
/*import {
  REQUEST_OVERVIEW,
  RECEIVE_OVERVIEW,
  RECEIVE_OVERVIEW_FAILED
} from './overviewConstants';*/

const initialState = {
  data: null,
  isLoading: false,
  error: false
};

export default function overview(state = initialState, action) {
  switch (action.type) {

    case 'REQUEST_OVERVIEW':
      return Object.assign({}, state, {
        isLoading : true,
        error : false
      });

    case 'RECEIVE_OVERVIEW':
      return Object.assign({}, state, {
        data : action.data,
        isLoading : false,
        error : false
      });

    case 'RECEIVE_OVERVIEW_FAILED':
      return Object.assign({}, state, {
        isLoading : false,
        error : true
      });

    default:
      return state;
  }
}
