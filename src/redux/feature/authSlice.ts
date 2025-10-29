import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  isLogin: false,
  isLogOut: false,
  userData: null,
  token: null,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.isLogin = true;
      state.isLogOut = false;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.isLogin = false;
      state.isLogOut = true;
      state.userData = null;
      state.token = null;
    },
    resetAuth(state) {
      return initialState;
    },
  },
});

export const { setLoading, loginSuccess, logout, resetAuth } = AuthSlice.actions;
export default AuthSlice.reducer;
