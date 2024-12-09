// reducers/authReducer.js

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, IS_LOG_IN } from '../types/type';

const initialState = {
  loading: false,
  account: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: localStorage.getItem('token') && localStorage.getItem('user') ? true : false, // Check if token exists in localStorage
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        account: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case LOGIN_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false, 
      };
    case LOGOUT:
      return { 
        ...state, 
        account: null, 
        token: null, 
        isAuthenticated: false, 
        error: null 
      };
    case IS_LOG_IN:
      return {
        ...state,
        isAuthenticated: action.payload,
        account: action.payload ? state.account : null,
        token: action.payload ? state.token : null,
      };
    default:
      return state;
  }
};

export default authReducer;
