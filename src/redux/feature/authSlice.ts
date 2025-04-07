import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 

// Initial state
const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  isLogin: false,
  isLogOut: false,
  userData: null,
  token: null,
  forgotData: null,
  betOption: null,
  gameResult: null,
  newbetOption: null,
};
 
// Slice
const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
  },
});

export const { loginSuccess, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
