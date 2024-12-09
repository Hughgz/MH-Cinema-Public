// billReducer.js

import { CREATE_BILL_REQUEST, CREATE_BILL_SUCCESS, CREATE_BILL_FAILURE } from '../types/type';

const initialState = {
  loading: false,
  bill: null,
  error: null,
};

const billReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BILL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_BILL_SUCCESS:
      return {
        ...state,
        loading: false,
        bill: action.payload,
      };
    case CREATE_BILL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default billReducer;
