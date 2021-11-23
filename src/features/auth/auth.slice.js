import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ethBalance: "--",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEthBalance(state, { payload }) {
      state.ethBalance = payload;
    },
  },
});

const selectEthBalance = ({ auth: { ethBalance } }) => ethBalance;
const { reducer: authReducer } = authSlice;
const { setEthBalance } = authSlice.actions;

export { selectEthBalance, authReducer, setEthBalance };
