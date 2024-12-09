// actions/authActions.js

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, IS_LOG_IN } from '../types/type';

export const isLogIn = (isLoggedIn) => ({  
    type: IS_LOG_IN,
    payload: isLoggedIn,
});

export const login = (credentials) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: credentials.phoneNumber,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'An error occurred';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (err) {
          console.error('Error parsing response JSON:', err);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Update the localStorage with the token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Dispatch LOGIN_SUCCESS to update the state
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: data.token,
          user: data.user,
        },
      });

      // Manually dispatch the IS_LOG_IN action to ensure `isAuthenticated` is set
      dispatch(isLogIn(true)); // This will ensure that `isAuthenticated` is set to true

    } catch (error) {
      console.error('Login error:', error.message);

      dispatch({
        type: LOGIN_FAILURE,
        payload: error.message,
      });
    }
  };
};


export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    dispatch({ type: LOGOUT });
  };
};

export const updateAccount = (accountData) => {
    return async (dispatch) => {
      try {
        const response = await fetch('http://localhost:8080/api/user/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            
          },
          body: JSON.stringify(accountData),
        });
  
        if (response.ok) {
          const data = await response.json();
          
          dispatch({
            type: 'UPDATE_ACCOUNT_SUCCESS',
            payload: data,
          });

          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          throw new Error('Failed to update account');
        }
      } catch (error) {
        console.error('Error updating account:', error);
        dispatch({
          type: 'UPDATE_ACCOUNT_FAILURE',
          payload: error.message,
        });
      }
    };
  };