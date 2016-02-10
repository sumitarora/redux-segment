import { login } from '../api/login';
import { EventTypes } from 'redux-segment';

import {
  LOGIN_USER_PENDING,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER,
  FORM_RESET,
} from '../constants';

export function loginUser() {
  return (dispatch, getState) => {
    const username = getState().form.login.username.value;
    const password = getState().form.login.password.value;

    return dispatch({
      types: [
        LOGIN_USER_PENDING,
        LOGIN_USER_SUCCESS,
        LOGIN_USER_ERROR,
      ],
      payload: {
        promise: login(username, password)
          .then((res) => {
            dispatch({
              type: FORM_RESET,
              form: 'login',
            });

            return res;
          }),
      },
      meta: {
        analytics: EventTypes.identify,
      },
    });
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}
