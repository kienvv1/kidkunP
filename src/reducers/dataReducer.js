// src/reducers/dataReducer.js
const initialState = {
  data: null,
  token: null,
  notificationData: null,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {...state, data: action.payload};
    case 'SET_TOKEN':
      return {...state, token: action.payload};
    case 'UPDATE_NOTIFICATION_DATA':
      return {
        ...state,
        notificationData: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
