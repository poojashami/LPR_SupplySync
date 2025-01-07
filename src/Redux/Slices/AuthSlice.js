import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const token = localStorage.getItem('token');
const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString !== null ? JSON.parse(userInfoString) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo,
    token,
    isFetching: false,
    error: false,
    errMsg: '',
    isLogged: Boolean(token)
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.isLogged = false;
    },

    loginSuccess: (state, action) => {
      state.errMsg = '';
      state.isFetching = false;
      state.error = false;
      state.userInfo = {
        first_name: action.payload.first_name,
        email: action.payload.email,
        role: action.payload.role
      };
      state.token = action.payload.servicetoken;
      state.isLogged = true;
      toast.success(`Logged in Successfully!`);
      localStorage.setItem('token', state.token);
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          first_name: action.payload.first_name,
          email: action.payload.email,
          role: action.payload.role
        })
      );
    },
    loginFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
      state.isLogged = false;
      toast.error(`An error has occurred!`);
    },
    UpdateStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    UpdateSuccess: (state, action) => {
      state.errMsg = '';
      state.isFetching = false;
      state.userInfo = action.payload.user;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    UpdateFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },
    createUserStart: (state) => {
      state.error = false;
      state.isFetching = true;
    },
    createUserSuccess: (state) => {
      toast.success(`Signed in Successfully!`);
      state.error = false;
      state.isFetching = false;
    },
    createUserFailure: (state) => {
      state.error = true;
      state.isFetching = false;
    },
    logOut: (state) => {
      toast.error(`Sign-up failed!`);
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    }
  }
});

export const {
  logOut,
  loginStart,
  loginSuccess,
  loginFailure,
  createUserStart,
  createUserSuccess,
  createUserFailure,
  UpdateStart,
  UpdateSuccess,
  UpdateFailure
} = authSlice.actions;
export default authSlice.reducer;
