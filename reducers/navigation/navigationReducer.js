
const initialState = {
  data: null
};

export default function navigation(state = initialState, action) {

  console.log("Navigation: action", action);

  switch (action.type) {

    case 'ADD_READING':
    case 'READINGS':
    case 'DETAILS':
      console.log("Navigation: appending data", action.data);
      return Object.assign({}, initialState, {
        data: action.data
      });

    case 'OVERVIEW':
      console.log("Navigation: returning initial state");
      return initialState;

    default:
      return state;
  }
}
