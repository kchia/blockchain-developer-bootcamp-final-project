import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../common/constants";

const fetchEllipticals = createAsyncThunk(
  "ellipticals/ellipticalsFetched",
  async ({ contract, active }, { getState }) => {
    const { fetchEllipticalsStatus } = getState().ellipticals;
    if (!contract || !active || fetchEllipticalsStatus !== STATUS.loading)
      return [];

    const ellipticalsCount = await contract.getEllipticalsCount();

    const ellipticals = [];
    for (let index = 0; index < ellipticalsCount; index++) {
      const { name, description, v1, v2, v3, alpha, x, y, w, h } =
        await contract.ellipticals(index);

      ellipticals.push({
        name: name.toString(),
        description: description.toString(),
        v1: parseInt(v1),
        v2: parseInt(v2),
        v3: parseInt(v3),
        alpha: parseInt(alpha),
        x: parseInt(x),
        y: parseInt(y),
        w: parseInt(w),
        h: parseInt(h),
      });
    }
    return ellipticals;
  }
);

const fetchEllipticalsCount = createAsyncThunk(
  "ellipticals/ellipticalsCountFetched",
  async ({ contract, active }, { getState }) => {
    const { fetchEllipticalsCountStatus } = getState().ellipticals;
    if (!contract || !active || fetchEllipticalsCountStatus !== STATUS.loading)
      return;
    return parseInt(await contract.getEllipticalsCount());
  }
);

const mintRandomElliptical = createAsyncThunk(
  "ellipticals/ellipticalMinted",
  async ({ contract, signer, name, description }, { getState }) => {
    const { mintRandomEllipticalStatus } = getState().ellipticals;
    if (mintRandomEllipticalStatus !== STATUS.loading) return;
    const transaction = await contract
      .connect(signer)
      .requestNewRandomElliptical(name, description);

    await transaction.wait();
    return transaction.hash;
  }
);

const initialState = {
  elliptical: {},
  ellipticals: [],
  ellipticalsCount: 0,
  error: undefined,
  fetchEllipticalsCountStatus: STATUS.idle,
  fetchEllipticalsStatus: STATUS.idle,
  mintRandomEllipticalStatus: STATUS.idle,
  transactionHash: undefined,
};

const ellipticalsSlice = createSlice({
  name: "ellipticals",
  initialState,
  reducers: {
    ellipticalsReset(state) {
      state.ellipticals = [];
      state.ellipticalsCount = 0;
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
          state.error = null;
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
          state.ellipticalsCount = payload;
          state.error = null;
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
          state.mintRandomEllipticalStatus = STATUS.loading;
        }
      })
      .addCase(mintRandomElliptical.fulfilled, (state, { payload }) => {
        if (state.mintRandomEllipticalStatus === STATUS.loading) {
          state.mintRandomEllipticalStatus = STATUS.idle;
          state.transactionHash = payload;
          state.error = null;
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
const selectElliptical = ({ ellipticals: { elliptical } }) => elliptical;
const selectEllipticalsCount = ({ ellipticals: { ellipticalsCount } }) =>
  ellipticalsCount;
const selectError = ({ ellipticals: { error } }) => error;
const selectFetchEllipticalsStatus = ({
  ellipticals: { fetchEllipticalsStatus },
}) => fetchEllipticalsStatus;
const selectFetchEllipticalsCountStatus = ({
  ellipticals: { fetchEllipticalsCountStatus },
}) => fetchEllipticalsCountStatus;
const selectTransactionHash = ({ ellipticals: { transactionHash } }) =>
  transactionHash;
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
  selectElliptical,
  selectEllipticalsCount,
  selectError,
  selectFetchEllipticalsStatus,
  selectFetchEllipticalsCountStatus,
  selectTransactionHash,
};
