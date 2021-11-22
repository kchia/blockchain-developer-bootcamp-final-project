import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../common/constants";
import { list } from "./coins.service.js";

const fetchCoins = createAsyncThunk(
  "coins/coinsFetched",
  (signal, { getState }) => {
    const { status } = getState().coins;
    if (status !== STATUS.loading) return;
    return list(signal);
  }
);

const initialState = {
  coins: [],
  status: STATUS.idle,
  error: null,
};

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    coinsReset(state) {
      state = { ...initialState };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCoins.pending, (state, action) => {
        if (state.status === STATUS.idle) {
          state.status = STATUS.loading;
        }
      })
      .addCase(fetchCoins.fulfilled, (state, { payload }) => {
        if (state.status === STATUS.loading) {
          state.status = STATUS.idle;
          state.coins = state.coins.concat(payload);
        }
      })
      .addCase(fetchCoins.rejected, (state, { error: { message } }) => {
        if (state.status === STATUS.loading) {
          state.status = STATUS.idle;
          state.error = message;
        }
      });
  },
});

const selectAllCoins = ({ coins: { coins } }) => coins;
const selectFetchCoinsStatus = ({ coins: { status } }) => status;
const { reducer: coinsReducer } = coinsSlice;
const { coinsReset } = coinsSlice.actions;

export {
  coinsReducer,
  coinsReset,
  fetchCoins,
  selectAllCoins,
  selectFetchCoinsStatus,
};
