import { createSlice } from "@reduxjs/toolkit";
import { getAuthToken } from "../helpers/jwt";

const initialState = {
  isAuth: false,
  user: {}
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleIsAuth(state, action) {
      state.isAuth = action.payload.isAuth;
      state.user = action.payload.user
    },
    getState(state) {
      if (!state.isAuth) {
        state = getAuthToken();
      }
      return state;
    },
  },
});

export const { toggleIsAuth, getState } = authSlice.actions;

export const authReducer = authSlice.reducer;
