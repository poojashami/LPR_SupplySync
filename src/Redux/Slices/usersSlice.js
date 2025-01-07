import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const userMasterSlice = createSlice({
  name: 'userMaster',
  initialState: {
    users: [],
    roles: [],
    departments: [],
    designations: [],
    isFetching: false,
    error: false
  },
  reducers: {
    usersFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    usersFetchSuccess: (state, action) => {
      toast.success(`Users Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.users = action.payload.data;
    },
    usersFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    rolesFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    rolesFetchSuccess: (state, action) => {
      toast.success(`roles Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.roles = action.payload.data;
    },
    rolesFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    departmentsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    departmentsFetchSuccess: (state, action) => {
      toast.success(`departments Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.departments = action.payload.data;
    },
    departmentsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    designationsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    designationsFetchSuccess: (state, action) => {
      toast.success(`designations Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.designations = action.payload.data;
    },
    designationsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    userCreateStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    userCreateSuccess: (state, action) => {
      toast.success(`User created Successfully`);
      state.isFetching = false;
      state.error = false;
      state.users = action.payload.data;
    },
    userCreateFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    }
  }
});

export const {
  usersFetchStart,
  usersFetchSuccess,
  usersFetchFailure,
  rolesFetchStart,
  rolesFetchSuccess,
  rolesFetchFailure,
  nafdacsFetchStart,
  nafdacsFetchSuccess,
  nafdacsFetchFailure,
  criasFetchStart,
  criasFetchSuccess,
  criasFetchFailure,
  departmentsFetchStart,
  departmentsFetchSuccess,
  departmentsFetchFailure,
  designationsFetchStart,
  designationsFetchSuccess,
  designationsFetchFailure,
  userCreateStart,
  userCreateSuccess,
  userCreateFailure
} = userMasterSlice.actions;

export default userMasterSlice.reducer;
