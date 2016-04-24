/**
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

const initialFormState = {
  state: 'ADD_READING_FORM',
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
  fields: {

  }
};

const initialState = {
  data: null,
  form: initialFormState,
  isLoading: false,
  error: false
};

export default function readings(state = initialState, action) {
  switch (action.type) {
    
    // Form is being submitted, set flags to prevent double submit
    case 'ADD_READING_FORM_SUBMITTING':
    {
      const form = Object.assign({}, state.form, {
        isFetching: true
      });

      return Object.assign({}, state, {
        form
      });
    }

    // Form is not being send
    case 'ADD_READING_FORM_SUBMIT_COMPLETE':
    {
      const form = Object.assign({}, state.form, {
        isFetching: false
      });

      return Object.assign({}, state, {
        form
      });
    }

    /*case 'ADD_READING_FORM_CREATE':
    {
      console.log("readingsReducer: ADD_READING_FORM_CREATE");
      let formState = Object.assign({}, state.form, {
        fields: action.fields
      });

      return Object.assign({}, state, {
        form: formState
      });
    }
    case 'ADD_READING_FORM_SUBMIT':
    {
      let formState = Object.assign({}, state.form, {
        isFetching: true
      });

      return Object.assign({}, state, {
        form: formState
      });
    }

    case 'REQUEST_MEASUREMENT':
      return Object.assign({}, state, {
        isLoading : true,
        error : false
      });

    case 'RECEIVE_MEASUREMENT':
      return Object.assign({}, state, {
        data : action.data,
        isLoading : false,
        error : false
      });

    case 'RECEIVE_MEASUREMENT_FAILED':
      return Object.assign({}, state, {
        isLoading : false,
        error : true
      });*/

    default:
      return state;
  }
}

