import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { getAuthToken } from "../helpers/jwt";

const initialState = {
  isAuth: false,
  user: {}
};

// export const getUserData = createAsyncThunk("auth/getUserData", async (params) => {
//   const { data } = await axios.post("/auth/login", params);
//   return data;
// });

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
  // extraReducers: {
  //   [getUserData.pending]: (state, action) => {
  //     state.data = null
  //     state.status = "loading";
  //   },
  //   [getUserData.fulfilled]: (state, action) => {
  //     state.data = action.payload;
  //     state.status = "loaded";
  //   },
  //   [getUserData.rejected]: (state, action) => {
  //     state.data = null
  //     state.status = "error";
  //   }
  // },
});

export const { toggleIsAuth, getState } = authSlice.actions;

export const authReducer = authSlice.reducer;
