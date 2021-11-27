import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../common/constants";

const fetchEllipticals = createAsyncThunk(
  "ellipticals/ellipticalsFetched",
  (contract, { getState }) => {
    const { fetchEllipticalsStatus } = getState().ellipticals;
    if (fetchEllipticalsStatus !== STATUS.loading) return;
    return contract.Ellipticals();
  }
);

const fetchEllipticalsCount = createAsyncThunk(
  "ellipticals/ellipticalsCountFetched",
  (contract, { getState }) => {
    const { fetchEllipticalsCountStatus } = getState().ellipticals;
    if (fetchEllipticalsCountStatus !== STATUS.loading) return;
    return contract.getEllipticalsCount();
  }
);

const mintRandomElliptical = createAsyncThunk(
  "ellipticals/randomEllipticalMinted",
  ({ contract, signer, name, description, image }, { getState }) => {
    const { mintRandomEllipticalStatus } = getState().ellipticals;
    if (mintRandomEllipticalStatus !== STATUS.loading) return;
    return contract
      .connect(signer)
      .requestNewRandomElliptical(name, description, image);
  }
);

const initialState = {
  ellipticals: [],
  ellipticalsCount: 0,
  error: null,
  fetchEllipticalsCountStatus: STATUS.idle,
  fetchEllipticalsStatus: STATUS.idle,
  mintRandomEllipticalStatus: STATUS.idle,
};

const ellipticalsSlice = createSlice({
  name: "ellipticals",
  initialState,
  reducers: {
    ellipticalsReset(state) {
      state = initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEllipticals.pending, (state, action) => {
        if (state.fetchEllipticalsStatus === STATUS.idle) {
          state.fetchEllipticalsStatus = STATUS.loading;
        }
      })
      .addCase(fetchEllipticals.fulfilled, (state, { payload }) => {
        if (state.fetchEllipticalsStatus === STATUS.loading) {
          state.fetchEllipticalsStatus = STATUS.idle;
          state.ellipticals = payload;
        }
      })
      .addCase(fetchEllipticals.rejected, (state, { error: { message } }) => {
        if (state.fetchEllipticalsStatus === STATUS.loading) {
          state.fetchEllipticalsStatus = STATUS.idle;
          state.error = message;
        }
      })
      .addCase(fetchEllipticalsCount.pending, (state, action) => {
        if (state.fetchEllipticalsCountStatus === STATUS.idle) {
          state.fetchEllipticalsCountStatus = STATUS.loading;
        }
      })
      .addCase(fetchEllipticalsCount.fulfilled, (state, { payload }) => {
        if (state.fetchEllipticalsCountStatus === STATUS.loading) {
          state.fetchEllipticalsCountStatus = STATUS.idle;
          state.ellipticalsCount = payload.toNumber();
        }
      })
      .addCase(
        fetchEllipticalsCount.rejected,
        (state, { error: { message } }) => {
          if (state.fetchEllipticalsCountStatus === STATUS.loading) {
            state.fetchEllipticalsCountStatus = STATUS.idle;
            state.error = message;
          }
        }
      )
      .addCase(mintRandomElliptical.pending, (state, action) => {
        if (state.mintRandomEllipticalStatus === STATUS.idle) {
          state.mintRandomEllipticalstatus = STATUS.loading;
        }
      })
      .addCase(mintRandomElliptical.fulfilled, (state, { payload }) => {
        if (state.mintRandomEllipticalStatus === STATUS.loading) {
          state.mintRandomEllipticalstatus = STATUS.idle;
          state.ellipticals = state.ellipticals.concat(payload);
        }
      })
      .addCase(
        mintRandomElliptical.rejected,
        (state, { error: { message } }) => {
          if (state.mintRandomEllipticalStatus === STATUS.loading) {
            state.mintRandomEllipticalStatus = STATUS.idle;
            state.error = message;
          }
        }
      );
  },
});

const selectAllEllipticals = ({ ellipticals: { ellipticals } }) => ellipticals;
const selectEllipticalsCount = ({ ellipticals: { ellipticals } }) =>
  ellipticals;
const selectFetchEllipticalsStatus = ({
  ellipticals: { fetchEllipticalsStatus },
}) => fetchEllipticalsStatus;
const selectFetchEllipticalsCountStatus = ({
  ellipticals: { fetchEllipticalsCountStatus },
}) => fetchEllipticalsCountStatus;
const selectMintRandomEllipticalStatus = ({
  ellipticals: { mintRandomEllipticalStatus },
}) => mintRandomEllipticalStatus;
const { reducer: ellipticalsReducer } = ellipticalsSlice;
const { ellipticalsReset } = ellipticalsSlice.actions;

export {
  ellipticalsReducer,
  ellipticalsReset,
  fetchEllipticals,
  fetchEllipticalsCount,
  mintRandomElliptical,
  selectMintRandomEllipticalStatus,
  selectAllEllipticals,
  selectEllipticalsCount,
  selectFetchEllipticalsStatus,
  selectFetchEllipticalsCountStatus,
};
