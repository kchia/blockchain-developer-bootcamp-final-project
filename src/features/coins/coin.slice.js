import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../common/constants";
import { read } from "./coins.service.js";

const fetchCoin = createAsyncThunk("coin/coinFetched", (data, { getState }) => {
  const { status } = getState().coin;
  if (status !== STATUS.loading) return;
  return read(data);
});

const initialState = {
  coin: {},
  status: STATUS.idle,
  error: null,
};

const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    coinReset(state) {
      state = { ...initialState };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCoin.pending, (state, action) => {
        if (state.status === STATUS.idle) {
          state.status = STATUS.loading;
        }
      })
      .addCase(fetchCoin.fulfilled, (state, { payload }) => {
        if (state.status === STATUS.loading) {
          state.status = STATUS.idle;
          state.coin = payload;
        }
      })
      .addCase(fetchCoin.rejected, (state, { error: { message } }) => {
        if (state.status === STATUS.loading) {
          state.status = STATUS.idle;
          state.error = message;
        }
      });
  },
});

const selectCoin = ({ coin: { coin } }) => coin;
const selectFetchCoinStatus = ({ coin: { status } }) => status;
const { reducer: coinReducer } = coinSlice;
const { coinReset } = coinSlice.actions;

export { coinReducer, coinReset, fetchCoin, selectCoin, selectFetchCoinStatus };
