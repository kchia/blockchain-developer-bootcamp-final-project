import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../common/constants";

const fetchBubbles = createAsyncThunk(
  "bubbles/bubblesFetched",
  (contract, { getState }) => {
    const { fetchBubblesStatus } = getState().bubbles;
    if (fetchBubblesStatus !== STATUS.loading) return;
    return contract.bubbles();
  }
);

const fetchBubblesCount = createAsyncThunk(
  "bubbles/bubblesCountFetched",
  (contract, { getState }) => {
    const { fetchBubblesCountStatus } = getState().bubbles;
    if (fetchBubblesCountStatus !== STATUS.loading) return;
    return contract.getBubblesCount();
  }
);

const initialState = {
  bubbles: [],
  bubblesCount: 0,
  fetchBubblesCountStatus: STATUS.idle,
  fetchBubblesStatus: STATUS.idle,
  error: null,
};

const bubblesSlice = createSlice({
  name: "bubbles",
  initialState,
  reducers: {
    bubblesReset(state) {
      state = initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBubbles.pending, (state, action) => {
        if (state.fetchBubblesStatus === STATUS.idle) {
          state.fetchBubblesStatus = STATUS.loading;
        }
      })
      .addCase(fetchBubbles.fulfilled, (state, { payload }) => {
        if (state.fetchBubblesStatus === STATUS.loading) {
          state.fetchBubblesStatus = STATUS.idle;
          state.bubbles = payload;
        }
      })
      .addCase(fetchBubbles.rejected, (state, { error: { message } }) => {
        if (state.fetchBubblesStatus === STATUS.loading) {
          state.fetchBubblesStatus = STATUS.idle;
          state.error = message;
        }
      })
      .addCase(fetchBubblesCount.pending, (state, action) => {
        if (state.fetchBubblesCountStatus === STATUS.idle) {
          state.fetchBubblesCountStatus = STATUS.loading;
        }
      })
      .addCase(fetchBubblesCount.fulfilled, (state, { payload }) => {
        if (state.fetchBubblesCountStatus === STATUS.loading) {
          state.fetchBubblesCountStatus = STATUS.idle;
          state.bubblesCount = payload.toNumber();
        }
      })
      .addCase(fetchBubblesCount.rejected, (state, { error: { message } }) => {
        if (state.fetchBubblesCountStatus === STATUS.loading) {
          state.fetchBubblesCountStatus = STATUS.idle;
          state.error = message;
        }
      });
  },
});

const selectAllBubbles = ({ bubbles: { bubbles } }) => bubbles;
const selectBubblesCount = ({ bubbles: { bubbles } }) => bubbles;
const selectFetchBubblesStatus = ({ bubbles: { fetchBubblesStatus } }) =>
  fetchBubblesStatus;
const selectFetchBubblesCountStatus = ({
  bubbles: { fetchBubblesCountStatus },
}) => fetchBubblesCountStatus;
const { reducer: bubblesReducer } = bubblesSlice;
const { bubblesReset } = bubblesSlice.actions;

export {
  bubblesReducer,
  bubblesReset,
  fetchBubbles,
  fetchBubblesCount,
  selectAllBubbles,
  selectBubblesCount,
  selectFetchBubblesStatus,
  selectFetchBubblesCountStatus,
};
