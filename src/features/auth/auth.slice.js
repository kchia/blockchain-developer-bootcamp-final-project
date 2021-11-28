import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { formatEther } from "@ethersproject/units";
import { STATUS } from "../../common/constants";

const fetchEthBalance = createAsyncThunk(
  "auth/ethBalanceFetched",
  async ({ library, active, account }, { getState }) => {
    const { status } = getState().auth;
    if (status !== STATUS.loading) return;
    return parseFloat(
      formatEther(await library.getBalance(account))
    ).toPrecision(4);
  }
);

const initialState = {
  ethBalance: "--",
  status: STATUS.idle,
  error: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEthBalance.pending, (state, action) => {
        if (state.status === STATUS.idle) {
          state.status = STATUS.loading;
        }
      })
      .addCase(fetchEthBalance.fulfilled, (state, { payload }) => {
        if (state.status === STATUS.loading) {
          state.status = STATUS.idle;
          state.ethBalance = payload;
        }
      })
      .addCase(fetchEthBalance.rejected, (state, { error: { message } }) => {
        if (state.status === STATUS.loading) {
          state.status = STATUS.idle;
          state.error = message;
        }
      });
  },
});

const selectEthBalance = ({ auth: { ethBalance } }) => ethBalance;
const selectStatus = ({ auth: { status } }) => status;
const { reducer: authReducer } = authSlice;

export { selectEthBalance, selectStatus, authReducer, fetchEthBalance };
