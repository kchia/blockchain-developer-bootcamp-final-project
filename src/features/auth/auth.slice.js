import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ethBalance: "--",
  contentError: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEthBalance(state, { payload }) {
      state.ethBalance = payload;
    },
    setContentError(state, { payload }) {
      state.contentError = payload;
    },
  },
});

const selectEthBalance = ({ auth: { ethBalance } }) => ethBalance;
const { reducer: authReducer } = authSlice;
const { setContentError, setEthBalance } = authSlice.actions;

export { selectEthBalance, authReducer, setContentError, setEthBalance };
